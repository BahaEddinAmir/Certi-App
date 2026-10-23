
const { ethers } = require("hardhat");

async function main() {
  const registry = await ethers.deployContract("CertificateRegistry");

  await registry.waitForDeployment();

  console.log("CertificateRegistry deployed to:");
  console.log(await registry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
