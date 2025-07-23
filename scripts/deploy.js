const hre = require("hardhat");

async function main() {
  console.log("Fetching contract factory for CrowdfundFactory...");

  const CrowdfundFactory = await hre.ethers.getContractFactory(
    "CrowdfundFactory"
  );

  console.log("Deploying CrowdfundFactory, please wait...");
  const crowdfundFactory = await CrowdfundFactory.deploy();

  await crowdfundFactory.waitForDeployment();

  console.log("----------------------------------------------------");
  console.log(
    `✅ CrowdfundFactory deployed to address: ${crowdfundFactory.target}`
  );
  console.log("----------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
