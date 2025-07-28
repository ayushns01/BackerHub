const hre = require("hardhat");
const { Wallet, JsonRpcProvider } = require("ethers");

// Provider is set to Sepolia Infura endpoint
const INFURA_URL =
  "";
const MNEMONIC =
  "";

async function main() {
  // Set up provider and wallet
  const provider = new JsonRpcProvider(INFURA_URL);
  const wallet = Wallet.fromPhrase(MNEMONIC, provider);

  console.log("Deploying contracts with:", wallet.address);

  // Deploy BackerHub with your wallet as signer
  const BackerHub = await hre.ethers.getContractFactory("BackerHub", wallet);
  const backerHub = await BackerHub.deploy();
  await backerHub.waitForDeployment();

  console.log("----------------------------------------------------");
  console.log(`✅ BackerHub deployed to address: ${backerHub.target}`);
  console.log("----------------------------------------------------");

  // --- Deploy a campaign via BackerHub ---
  const CAMPAIGN_NAME = "Test Campaign";
  const CAMPAIGN_DESC = "A test campaign deployed on Sepolia";
  const GOAL_AMOUNT = hre.ethers.parseEther("1.0");

  const tx = await backerHub.createCampaign(
    CAMPAIGN_NAME,
    CAMPAIGN_DESC,
    GOAL_AMOUNT
  );
  await tx.wait();
  console.log("✅ Campaign created via BackerHub!");

  // Get the deployed campaign address
  const deployedCampaigns = await backerHub.getDeployedCampaigns();
  const campaignAddress = deployedCampaigns[deployedCampaigns.length - 1];
  console.log("✅ Campaign deployed to address:", campaignAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
