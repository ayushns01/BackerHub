require("dotenv").config();
const { ethers } = require("hardhat");
const BackerHubABI = require("../backerhub-frontend/src/contracts/BackerHub.json");

const INFURA_URL =
  "https://sepolia.infura.io/v3/375de5fb16004e3189ab323ee1033f82";
const BACKERHUB_ADDRESS = process.env.BACKERHUB_ADDRESS;

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
