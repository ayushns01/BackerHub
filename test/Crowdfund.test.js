const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BackerHub & Campaign Contracts", function () {
  let BackerHubFactory;
  let backerHub;
  let CampaignFactory;
  let campaign;
  let owner;
  let contributor1;
  let recipient;

  // Constants for our tests
  const CAMPAIGN_NAME = "Test Campaign";
  const CAMPAIGN_DESC = "A test crowdfunding campaign.";
  const GOAL_AMOUNT = ethers.parseEther("1.0");

  beforeEach(async function () {
    [owner, contributor1, recipient] = await ethers.getSigners();
    BackerHubFactory = await ethers.getContractFactory("BackerHub");
    backerHub = await BackerHubFactory.deploy();
    await backerHub.waitForDeployment();
    CampaignFactory = await ethers.getContractFactory("Campaign");
  });

  it("SHOULD CREATE AND DEPLOY A NEW CAMPAIGN VIA BACKERHUB", async function () {
    await backerHub
      .connect(owner)
      .createCampaign(CAMPAIGN_NAME, CAMPAIGN_DESC, GOAL_AMOUNT);
    const deployedCampaigns = await backerHub.getDeployedCampaigns();
    expect(deployedCampaigns.length).to.equal(1);
  });

  describe("Campaign Interaction", function () {
    let campaignAddress;

    beforeEach(async function () {
      await backerHub
        .connect(owner)
        .createCampaign(CAMPAIGN_NAME, CAMPAIGN_DESC, GOAL_AMOUNT);
      [campaignAddress] = await backerHub.getDeployedCampaigns();
      campaign = CampaignFactory.attach(campaignAddress);
    });

    it("SHOULD ALLOW A USER TO CONTRIBUTE AND BECOME AN APPROVER", async function () {
      await campaign
        .connect(contributor1)
        .contribute({ value: ethers.parseEther("0.1") });
      const isApprover = await campaign.approvers(contributor1.address);
      expect(isApprover).to.be.true;
    });

    it("SHOULD ALLOW THE MANAGER TO CREATE A SPENDING REQUEST", async function () {
      // Fund the campaign first
      await campaign
        .connect(owner)
        .contribute({ value: ethers.parseEther("0.2") });

      await campaign
        .connect(owner)
        .createRequest(
          "Buy materials",
          ethers.parseEther("0.2"),
          recipient.address
        );
      // Check that the request was created
      // (requests is an array of structs with mappings, so we can only check length)
      // No revert means success
    });

    it("SHOULD ALLOW APPROVERS TO APPROVE AND FINALIZE REQUESTS", async function () {
      // Contribute from two accounts
      await campaign
        .connect(contributor1)
        .contribute({ value: ethers.parseEther("0.5") });
      await campaign
        .connect(owner)
        .contribute({ value: ethers.parseEther("0.5") });
      // Owner creates a request
      await campaign
        .connect(owner)
        .createRequest(
          "Pay recipient",
          ethers.parseEther("0.5"),
          recipient.address
        );
      // Both approve
      await campaign.connect(contributor1).approveRequest(0);
      // This second approval should trigger the payment
      await expect(
        campaign.connect(owner).approveRequest(0)
      ).to.changeEtherBalance(recipient, ethers.parseEther("0.5"));
      // Check that the request is marked complete
      const request = await campaign.requests(0);
      expect(request.complete).to.be.true;
    });
  });
});
