const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BackerHub & Campaign Contracts", function () {
  let BackerHubFactory;
  let backerHub;
  let CampaignFactory;
  let campaign;
  let owner;
  let contributor1;
  let contributor2;
  let contributor3;
  let recipient;

  const CAMPAIGN_NAME = "Test Campaign";
  const CAMPAIGN_DESC = "A test crowdfunding campaign.";
  const GOAL_AMOUNT = ethers.parseEther("1.0");

  beforeEach(async function () {
    [owner, contributor1, contributor2, contributor3, recipient] =
      await ethers.getSigners();
    BackerHubFactory = await ethers.getContractFactory("BackerHub");
    backerHub = await BackerHubFactory.deploy();
    await backerHub.waitForDeployment();
    CampaignFactory = await ethers.getContractFactory("Campaign");
  });

  it("SHOULD CREATE AND DEPLOY A NEW CAMPAIGN VIA BACKERHUB", async function () {
    // The owner creates the campaign
    await backerHub
      .connect(owner)
      .createCampaign(CAMPAIGN_NAME, CAMPAIGN_DESC, GOAL_AMOUNT);
    const deployedCampaigns = await backerHub.getDeployedCampaigns();
    expect(deployedCampaigns.length).to.equal(1);
    // Attach to the deployed campaign and check its parameters
    const campaignAddress = deployedCampaigns[0];
    const campaign = CampaignFactory.attach(campaignAddress);
    expect(await campaign.name()).to.equal(CAMPAIGN_NAME);
    expect(await campaign.description()).to.equal(CAMPAIGN_DESC);
    expect(await campaign.goalAmount()).to.equal(GOAL_AMOUNT);
    expect(await campaign.manager()).to.equal(owner.address);
  });

  it("DEPLOYS BOTH BACKERHUB AND CAMPAIGN, AND AUTOMATICALLY TRANSFERS MONEY TO RECIPIENT", async function () {
    // Deploy campaign
    await backerHub
      .connect(owner)
      .createCampaign(CAMPAIGN_NAME, CAMPAIGN_DESC, GOAL_AMOUNT);
    const [campaignAddress] = await backerHub.getDeployedCampaigns();
    const campaign = CampaignFactory.attach(campaignAddress);
    // Contribute from two accounts
    await campaign
      .connect(owner)
      .contribute({ value: ethers.parseEther("0.5") });
    await campaign
      .connect(contributor1)
      .contribute({ value: ethers.parseEther("0.5") });
    // Owner creates a request
    await campaign
      .connect(owner)
      .createRequest(
        "Pay recipient",
        ethers.parseEther("1.0"),
        recipient.address
      );
    // Both approve, triggering automatic transfer
    await campaign.connect(owner).approveRequest(0);
    await expect(
      campaign.connect(contributor1).approveRequest(0)
    ).to.changeEtherBalance(recipient, ethers.parseEther("1.0"));
    // Check that the request is marked complete
    const request = await campaign.requests(0);
    expect(request.complete).to.be.true;
  });

  describe("Campaign Interaction", function () {
    let campaignAddress;

    beforeEach(async function () {
      // The owner is the one creating the campaign
      await backerHub
        .connect(owner)
        .createCampaign(CAMPAIGN_NAME, CAMPAIGN_DESC, GOAL_AMOUNT);
      [campaignAddress] = await backerHub.getDeployedCampaigns();
      campaign = CampaignFactory.attach(campaignAddress);
    });

    // --- Contributions ---
    it("ACCEPTS contributions and adds contributor to approvers", async function () {
      await campaign
        .connect(contributor1)
        .contribute({ value: ethers.parseEther("0.1") });
      const isApprover = await campaign.approvers(contributor1.address);
      expect(isApprover).to.be.true;
    });

    it("INCREMENTS approversCount only once for repeat contributor", async function () {
      await campaign
        .connect(contributor1)
        .contribute({ value: ethers.parseEther("0.1") });
      await campaign
        .connect(contributor1)
        .contribute({ value: ethers.parseEther("0.2") });
      const count = await campaign.approversCount();
      expect(count).to.equal(1);
    });

    it("INCREASES amountRaised correctly", async function () {
      await campaign
        .connect(contributor1)
        .contribute({ value: ethers.parseEther("0.1") });
      await campaign
        .connect(contributor2)
        .contribute({ value: ethers.parseEther("0.2") });
      const raised = await campaign.amountRaised();
      expect(raised).to.equal(ethers.parseEther("0.3"));
    });

    // --- Request Creation ---
    it("ALLOWS the manager to create a request", async function () {
      await campaign
        .connect(owner)
        .contribute({ value: ethers.parseEther("0.2") }); // Manager must have funds to request against
      await campaign
        .connect(owner)
        .createRequest(
          "Buy materials",
          ethers.parseEther("0.1"),
          recipient.address
        );
      const request = await campaign.requests(0);
      expect(request.description).to.equal("Buy materials");
    });

    it("REJECTS requests from non-manager", async function () {
      await expect(
        campaign
          .connect(contributor1)
          .createRequest(
            "Not allowed",
            ethers.parseEther("0.1"),
            recipient.address
          )
      ).to.be.revertedWith("Only the manager can perform this action.");
    });

    it("REJECTS requests for more than contract balance", async function () {
      await campaign
        .connect(owner)
        .contribute({ value: ethers.parseEther("0.2") });
      await expect(
        campaign
          .connect(owner)
          .createRequest(
            "Too much",
            ethers.parseEther("0.3"),
            recipient.address
          )
      ).to.be.revertedWith("Request value exceeds contract balance.");
    });

    // --- Voting Logic ---
    it("ALLOWS a valid contributor to approve a request", async function () {
      await campaign
        .connect(owner)
        .contribute({ value: ethers.parseEther("0.2") });
      await campaign
        .connect(owner)
        .createRequest("Buy", ethers.parseEther("0.1"), recipient.address);
      await campaign.connect(owner).approveRequest(0); // owner is a contributor
      const request = await campaign.requests(0);
      expect(request.approvalCount).to.equal(1);
    });

    it("REJECTS votes from non-contributors", async function () {
      await campaign
        .connect(owner)
        .contribute({ value: ethers.parseEther("0.2") });
      await campaign
        .connect(owner)
        .createRequest("Buy", ethers.parseEther("0.1"), recipient.address);
      await expect(
        campaign.connect(contributor1).approveRequest(0)
      ).to.be.revertedWith("You must be a contributor to perform this action.");
    });

    it("REJECTS a second vote from the same person on the same request", async function () {
      // 3 contributors so one vote does not complete the request
      await campaign
        .connect(owner)
        .contribute({ value: ethers.parseEther("0.2") });
      await campaign
        .connect(contributor1)
        .contribute({ value: ethers.parseEther("0.2") });
      await campaign
        .connect(contributor2)
        .contribute({ value: ethers.parseEther("0.2") });
      await campaign
        .connect(owner)
        .createRequest("Buy", ethers.parseEther("0.1"), recipient.address);
      await campaign.connect(owner).approveRequest(0);
      // Try to vote again before majority is reached
      await expect(
        campaign.connect(owner).approveRequest(0)
      ).to.be.revertedWith("You have already voted on this request.");
    });

    it("DOES NOT send money if vote count is less than or equal to 50%", async function () {
      await campaign
        .connect(owner)
        .contribute({ value: ethers.parseEther("0.2") });
      await campaign
        .connect(contributor1)
        .contribute({ value: ethers.parseEther("0.2") });
      await campaign
        .connect(owner)
        .createRequest("Buy", ethers.parseEther("0.2"), recipient.address);
      // Only one of two contributors approves
      await expect(
        campaign.connect(owner).approveRequest(0)
      ).to.not.changeEtherBalance(recipient, ethers.parseEther("0.2"));
    });

    it("AUTOMATICALLY sends money when vote count goes above 50%", async function () {
      await campaign
        .connect(owner)
        .contribute({ value: ethers.parseEther("0.2") });
      await campaign
        .connect(contributor1)
        .contribute({ value: ethers.parseEther("0.2") });
      await campaign
        .connect(owner)
        .createRequest("Buy", ethers.parseEther("0.2"), recipient.address);
      await campaign.connect(owner).approveRequest(0);
      await expect(
        campaign.connect(contributor1).approveRequest(0)
      ).to.changeEtherBalance(recipient, ethers.parseEther("0.2"));
    });

    it("REJECTS votes for a request that is already complete", async function () {
      await campaign
        .connect(owner)
        .contribute({ value: ethers.parseEther("0.2") });
      await campaign
        .connect(contributor1)
        .contribute({ value: ethers.parseEther("0.2") });
      await campaign
        .connect(owner)
        .createRequest("Buy", ethers.parseEther("0.2"), recipient.address);
      await campaign.connect(owner).approveRequest(0);
      await campaign.connect(contributor1).approveRequest(0); // triggers completion
      // Attempting to vote again on the completed request
      await expect(
        campaign.connect(owner).approveRequest(0)
      ).to.be.revertedWith("Request has already been completed.");
    });

    it("HANDLES different majority scenarios (e.g., 2 out of 3 voters)", async function () {
      await campaign
        .connect(owner)
        .contribute({ value: ethers.parseEther("0.2") });
      await campaign
        .connect(contributor1)
        .contribute({ value: ethers.parseEther("0.2") });
      await campaign
        .connect(contributor2)
        .contribute({ value: ethers.parseEther("0.2") });
      await campaign
        .connect(owner)
        .createRequest("Buy", ethers.parseEther("0.2"), recipient.address);
      // 1/3: not enough
      await campaign.connect(owner).approveRequest(0);
      // 2/3: triggers payment
      await expect(
        campaign.connect(contributor1).approveRequest(0)
      ).to.changeEtherBalance(recipient, ethers.parseEther("0.2"));
      // 3/3: further votes should be rejected as complete
      await expect(
        campaign.connect(contributor2).approveRequest(0)
      ).to.be.revertedWith("Request has already been completed.");
    });
  });
});
