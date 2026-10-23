
const { ethers } = require("hardhat");

async function main() {
  // Replace this with your deployed contract address.
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const registry = await ethers.getContractAt(
    "CertificateRegistry",
    contractAddress
  );

  // Simulate a certificate PDF by hashing a unique identifier.
  const certificateHash = ethers.keccak256(
    ethers.toUtf8Bytes("student-diploma-001.pdf")
  );

  console.log("Certificate hash:", certificateHash);

  // Register the certificate on the local blockchain.
  const tx = await registry.issueCertificate(certificateHash);
  const receipt = await tx.wait();

  console.log("Certificate issued successfully!");
  console.log("Transaction hash:", receipt.hash);
  console.log("Block number:", receipt.blockNumber);

  // Verify the registered certificate.
  const [valid, issuer, issuedAt] =
    await registry.verify(certificateHash);

  console.log("Certificate valid:", valid);
  console.log("Issuer:", issuer);
  console.log(
    "Issued at:",
    new Date(Number(issuedAt) * 1000).toISOString()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
