const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crowdfund Contracts", function () {
  let crowdfundFactory;
  let Crowdfund;
  let crowdfund;
  let owner;
  let contributor1;
  let contributor2;
  let recipient;

  const MINIMUM_CONTRIBUTION = ethers.parseEther("0.01");
  const GOAL_AMOUNT = ethers.parseEther("1.0");

  beforeEach(async function () {
    [owner, contributor1, contributor2, recipient] = await ethers.getSigners();

    // Deploy the CrowdfundFactory contract
    const CrowdfundFactory = await ethers.getContractFactory(
      "CrowdfundFactory"
    );
    crowdfundFactory = await CrowdfundFactory.connect(owner).deploy();
    await crowdfundFactory.deployed();

    // Deploy a new Crowdfund campaign as contributor1 (the creator/manager)
    await crowdfundFactory
      .connect(contributor1)
      .createCrowdfund(MINIMUM_CONTRIBUTION, GOAL_AMOUNT, 30);
    const deployedCrowdfunds = await crowdfundFactory.getDeployedCrowdfunds();
    const crowdfundAddress = deployedCrowdfunds[0];

    Crowdfund = await ethers.getContractFactory("Crowdfund");
    crowdfund = Crowdfund.attach(crowdfundAddress);
  });

  it("SHOULD CREATE AND DEPLOY NEW CROWDFUND CAMPAIGN", async function () {
    // Deploy a new Crowdfund campaign as contributor2 (the creator/manager)
    await crowdfundFactory
      .connect(contributor2)
      .createCrowdfund(MINIMUM_CONTRIBUTION, GOAL_AMOUNT, 30);
    const deployedCrowdfunds = await crowdfundFactory.getDeployedCrowdfunds();
    expect(deployedCrowdfunds.length).to.equal(2);
  });

  it("SHOULD SET THE MANAGER TO THE CREATOR ADDRESS", async function () {
    // The manager should be contributor1 for the first campaign
    expect(await crowdfund.manager()).to.equal(contributor1.address);
  });

  describe("crowdfund campaign interaction", function () {
    beforeEach(async function () {
      // Deploy a new Crowdfund campaign as owner (the creator/manager)
      await crowdfundFactory
        .connect(owner)
        .createCrowdfund(MINIMUM_CONTRIBUTION, GOAL_AMOUNT, 30);
      const deployedCrowdfunds = await crowdfundFactory.getDeployedCrowdfunds();
      // The latest deployed crowdfund is at the end
      const crowdfundAddress =
        deployedCrowdfunds[deployedCrowdfunds.length - 1];
      crowdfund = Crowdfund.attach(crowdfundAddress);
    });

    it("SHOULD ALLOW USER TO CONTRIBUTE AND BECOME APPROVER", async function () {
      await crowdfund
        .connect(contributor1)
        .contribute({ value: MINIMUM_CONTRIBUTION });
      const isApprover = await crowdfund.approvers(contributor1.address);
      expect(isApprover).to.be.true;
    });

    it("SHOULD REQUIRE A MINIMUM CONTRIBUTION TO BE APPROVED", async function () {
      const smallContribution = ethers.parseEther("0.001");
      await expect(
        crowdfund.connect(contributor1).contribute({ value: smallContribution })
      ).to.be.revertedWithCustomError(
        crowdfund,
        "Minimum Contribution Not  Met"
      );
    });

    it("SHOULD ONLY ALLOW THE MANAGER TO CREATE SPENDING REQUEST", async function () {
      await expect(
        crowdfund
          .connect(contributor1)
          .createRequest("test", 100, recipient.address)
      ).to.be.revertedWithCustomError(
        crowdfund,
        "Only Manager Can Create Request"
      );
    });

    it("SHOULD CREATE THE PAYMENT AUTOMATICALLY ON FINAL APPROVAL", async function () {
      await crowdfund
        .connect(contributor1)
        .contribute({ value: ethers.parseEther("0.5") });
      await crowdfund
        .connect(contributor2)
        .contribute({ value: ethers.parseEther("0.5") });

      const requestAmount = ethers.parseEther("0.8");
      await crowdfund
        .connect(owner)
        .createRequest("PAY FOR SERVICES", requestAmount, recipient.address);

      await crowdfund.connect(contributor1).approveRequest(0);

      await expect(
        crowdfund.connect(contributor2).approveRequest(0)
      ).to.changeEtherBalance(recipient, requestAmount);

      const request = await crowdfund.requests(0);
      expect(request.complete).to.be.true;
    });
  });
});
