// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CampaignFactory{
    address[] public deployedCampaigns;  

    function createCampaign(uint minimum) external {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() external view returns(address[] memory){
        return deployedCampaigns;
    }
}

contract Campaign {
    address public manager;
    uint256 public minimumContribution;
    uint256 public approversCount;
    
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
    }

    Request[] public requests;
    mapping(address => bool) public approvers;
    mapping(uint256 => mapping(address => bool)) public requestApprovals;

    event Contribution(address indexed contributor, uint256 amount);
    event RequestCreated(string description, uint256 value, address indexed recipient);
    event RequestApproved(uint256 indexed requestId, address indexed approver);

    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    modifier restricted() {
        require(msg.sender == manager, "Only manager can call this");
        _;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution, "Contribution too low");
        if (!approvers[msg.sender]) {
            approvers[msg.sender] = true;
            approversCount++;
        }
        emit Contribution(msg.sender, msg.value);
    }

    function createRequest(string memory description, uint256 value, address recipient) public restricted {
        require(value <= address(this).balance, "Request value exceeds contract balance");
        requests.push(Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        }));
        emit RequestCreated(description, value, recipient);
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender], "Not an approver");
        require(!requestApprovals[index][msg.sender], "Already approved");

        requestApprovals[index][msg.sender] = true;
        request.approvalCount++;

        emit RequestApproved(index, msg.sender);
    }

    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index]; 

        require(request.approvalCount > (approversCount / 2), "Not enough approvals");
        require(!request.complete, "Request already completed");
        require(request.value <= address(this).balance, "Insufficient contract balance");

        request.complete = true;
        payable(request.recipient).transfer(request.value);
    }
}
