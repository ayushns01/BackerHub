// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdfundFactory {

    address[] public deployedCrowdfunds;

    function createCrowdfund(uint256 minimum, uint256 goal, uint256 duration) external {
        address newCrowdfund = address(new Crowdfund(minimum, goal, duration, msg.sender));
        deployedCrowdfunds.push(newCrowdfund);
    }

    function getDeployedCrowdfunds() external view returns (address[] memory) {
        return deployedCrowdfunds;
    }
}

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/security/ReentrancyGuard.sol";

contract Crowdfund is ReentrancyGuard {

    address public immutable manager;
    uint256 public immutable minimumContribution;
    uint256 public immutable goalAmount;
    uint256 public immutable deadline;
    uint256 public amountRaised;
    uint256 public approversCount;


    enum State { Funding, Successful, Failed }
    State public state = State.Funding;

    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    mapping(address => bool) public approvers;

    // --- Events ---
    event Contribution(address indexed contributor, uint256 amount, uint256 totalRaised);
    event RequestCreated(uint256 indexed requestId, string description, uint256 value, address indexed recipient);
    event RequestApproved(uint256 indexed requestId, address indexed approver, uint256 newApprovalCount);
    event RequestFinalized(uint256 indexed requestId, uint256 value);

    // --- Modifiers ---
    modifier restricted() {
        require(msg.sender == manager, "Only the manager can perform this action.");
        _;
    }

    modifier onlyApprovers() {
        require(approvers[msg.sender], "You must be a contributor to perform this action.");
        _;
    }

    // --- Functions ---
    constructor(
        uint256 _minimum,
        uint256 _goal,
        uint256 _duration,
        address _creator
    ) {
        manager = _creator;
        minimumContribution = _minimum;
        goalAmount = _goal;
        deadline = block.timestamp + _duration;
    }

    function contribute() public payable {
        require(state == State.Funding, "Crowdfund is no longer accepting funds.");
        require(block.timestamp < deadline, "Crowdfund deadline has passed.");
        require(msg.value >= minimumContribution, "Contribution is below the minimum required.");
        amountRaised += msg.value;
        if (!approvers[msg.sender]) {
            approvers[msg.sender] = true;
            approversCount++;
        }
        emit Contribution(msg.sender, msg.value, amountRaised);
    }
    
    function checkCrowdfundStatus() public {
        require(state == State.Funding, "Crowdfund status has already been set.");
        require(block.timestamp >= deadline, "Funding period is not over yet.");
        if (amountRaised >= goalAmount) {
            state = State.Successful;
        } else {
            state = State.Failed;
        }
    }

    function createRequest(string memory _description, uint256 _value, address _recipient) public restricted {
        require(state == State.Successful, "Crowdfund was not successful, cannot create requests.");
        require(_value <= address(this).balance, "Request value exceeds contract balance.");
        Request storage newRequest = requests.push();
        newRequest.description = _description;
        newRequest.value = _value;
        newRequest.recipient = _recipient;
        emit RequestCreated(requests.length - 1, _description, _value, _recipient);
    }

    function approveRequest(uint256 _requestId) public onlyApprovers nonReentrant {
        Request storage request = requests[_requestId];
        require(!request.complete, "Request has already been finalized.");
        require(!request.approvals[msg.sender], "You have already approved this request.");

        request.approvals[msg.sender] = true;
        request.approvalCount++;
        emit RequestApproved(_requestId, msg.sender, request.approvalCount);

        // This check triggers the automatic payment.
        // Using the recommended majority rule (>50%) for safety.
        if (request.approvalCount > (approversCount / 2)) {
            require(address(this).balance >= request.value, "Insufficient funds to finalize this request.");
            request.complete = true;

            (bool sent, ) = request.recipient.call{value: request.value}("");
            require(sent, "Failed to send Ether to recipient.");
            
            emit RequestFinalized(_requestId, request.value);
        }
    }

    function getSummary() public view returns (
        address, uint256, uint256, uint256, uint256, uint256, uint256, State
    ) {
        return (manager, minimumContribution, goalAmount, deadline, amountRaised, approversCount, requests.length, state);
    }
}