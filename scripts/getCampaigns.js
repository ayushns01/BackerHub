require("dotenv").config();
const { ethers } = require("hardhat");
const BackerHubABI = require("../backerhub-frontend/src/contracts/BackerHub.json");

const INFURA_URL =
  "";
const BACKERHUB_ADDRESS = ;

async function main() {
  const provider = new ethers.JsonRpcProvider(INFURA_URL);
  const backerHub = new ethers.Contract(
    BACKERHUB_ADDRESS,
    BackerHubABI.abi,
    provider
  );

  const campaigns = await backerHub.getDeployedCampaigns();
  console.log("Deployed campaigns:", campaigns);
}

main().catch(console.error);
