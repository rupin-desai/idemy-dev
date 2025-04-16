const crypto = require("crypto");
const idGenerator = require("../utils/idGenerator.utils");

class NFT {
  constructor(tokenId, studentId, ownerAddress, metadataUri) {
    this.tokenId = tokenId || idGenerator.generateNftId();
    this.studentId = studentId;
    this.ownerAddress = ownerAddress;
    this.metadataUri = metadataUri;
    this.mintedAt = Date.now();
    this.lastTransferredAt = null;
    this.mintTxHash = null;
    this.status = "MINTED"; // MINTED, TRANSFERRED, REVOKED
  }

  calculateFingerprint() {
    return crypto
      .createHash("sha256")
      .update(`${this.tokenId}${this.studentId}${this.mintedAt}`)
      .digest("hex");
  }

  toJSON() {
    return {
      tokenId: this.tokenId,
      studentId: this.studentId,
      ownerAddress: this.ownerAddress,
      metadataUri: this.metadataUri,
      mintedAt: this.mintedAt,
      lastTransferredAt: this.lastTransferredAt,
      mintTxHash: this.mintTxHash,
      status: this.status,
      fingerprint: this.calculateFingerprint(),
    };
  }
}

module.exports = NFT;
