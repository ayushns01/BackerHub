// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract BackerHub {

    address[] public deployedCampaigns;


    function createCampaign(string memory name, string memory description, uint256 goalInWei) external {
        address newCampaign = address(new Campaign(name, description, goalInWei, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() external view returns (address[] memory) {
        return deployedCampaigns;
    }
}


import "@openzeppelin/contracts/security/ReentrancyGuard.sol";



contract Campaign is ReentrancyGuard {

    // --- State Variables ---

    string public name;
    string public description;
    address public immutable manager;
    uint256 public immutable goalAmount; 
    
    uint256 public amountRaised;
    uint256 public approversCount;

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
    event Contribution(address indexed contributor, uint256 amount);
    event RequestCreated(uint256 indexed requestId, string description, uint256 value, address indexed recipient);
    event RequestApproved(uint256 indexed requestId, address indexed approver);
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

    constructor(
        string memory _name,
        string memory _description,
        uint256 _goalInWei,
        address _creator
    ) {
        name = _name;
        description = _description;
        manager = _creator;
        goalAmount = _goalInWei;
    }


    function contribute() public payable {
        // Any amount is accepted.
        amountRaised += msg.value;
        
        // Add the contributor to the list of approvers if they are new.
        if (!approvers[msg.sender]) {
            approvers[msg.sender] = true;
            approversCount++;
        }
        
        emit Contribution(msg.sender, msg.value);
    }

    function createRequest(string memory _description, uint256 _valueInWei, address _recipient) public restricted {
        require(_valueInWei > 0, "Request value must be greater than zero.");
        require(_valueInWei <= address(this).balance, "Request value exceeds contract balance.");
        
        Request storage newRequest = requests.push();
        newRequest.description = _description;
        newRequest.value = _valueInWei;
        newRequest.recipient = _recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
        
        emit RequestCreated(requests.length - 1, _description, _valueInWei, _recipient);
    }


    function approveRequest(uint256 _requestId) public onlyApprovers nonReentrant {
        Request storage request = requests[_requestId];
        
        require(!request.complete, "Request has already been completed.");
        require(!request.approvals[msg.sender], "You have already voted on this request.");

        request.approvals[msg.sender] = true;
        request.approvalCount++;
        emit RequestApproved(_requestId, msg.sender);

        // --- THE MAJORITY RULE LOGIC ---
        // Check if the approval count is now greater than 50% of all contributors.
        if (request.approvalCount > (approversCount / 2)) {
            // Mark as complete *before* sending Ether to follow the Checks-Effects-Interactions pattern.
            request.complete = true;
            
            (bool sent, ) = request.recipient.call{value: request.value}("");
            require(sent, "Failed to send Ether to recipient.");
            
            emit RequestFinalized(_requestId, request.value);
        }
    }

    function getSummary() public view returns (
        address, uint256, uint256, uint256, uint256, string memory, string memory
    ) {
        return (
            manager,
            goalAmount,
            amountRaised,
            approversCount,
            requests.length,
            name,
            description
        );
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}