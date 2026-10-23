const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateRegistry", function () {
  let registry, owner, other;
  const hash = ethers.keccak256(ethers.toUtf8Bytes("diploma.pdf"));

  beforeEach(async () => {
    [owner, other] = await ethers.getSigners();
    registry = await ethers.deployContract("CertificateRegistry");
  });

  it("lets the owner issue and anyone verify", async () => {
    await registry.issueCertificate(hash);
    const [valid, issuer] = await registry.connect(other).verify(hash);
    expect(valid).to.equal(true);
    expect(issuer).to.equal(owner.address);
  });

  it("returns not valid for unknown hashes", async () => {
    const [valid] = await registry.verify(hash);
    expect(valid).to.equal(false);
  });

  it("rejects non-owners", async () => {
    await expect(registry.connect(other).issueCertificate(hash))
      .to.be.revertedWithCustomError(registry, "NotOwner");
  });

  it("rejects duplicates", async () => {
    await registry.issueCertificate(hash);
    await expect(registry.issueCertificate(hash))
      .to.be.revertedWithCustomError(registry, "AlreadyIssued");
  });

  it("emits an event", async () => {
    await expect(registry.issueCertificate(hash)).to.emit(registry, "CertificateIssued");
  });
});