const crypto = require("crypto");
const idGenerator = require("../utils/idGenerator.utils");

class NFT {
  constructor(tokenId, studentId, ownerAddress, metadataUri, cardNumber, version = 1, previousVersionId = null) {
    this.tokenId = tokenId || idGenerator.generateNftId();
    this.studentId = studentId;
    this.cardNumber = cardNumber; // Store the constant card number
    this.ownerAddress = ownerAddress;
    this.metadataUri = metadataUri;
    this.mintedAt = Date.now();
    this.lastTransferredAt = null;
    this.mintTxHash = null;
    this.status = "MINTED"; // MINTED, TRANSFERRED, REVOKED
    this.version = version;
    this.previousVersionId = previousVersionId; // Link to previous version
    this.isLatestVersion = true; // Flag for the latest version
  }

  calculateFingerprint() {
    return crypto
      .createHash("sha256")
      .update(`${this.tokenId}${this.studentId}${this.mintedAt}${this.version}`)
      .digest("hex");
  }

  toJSON() {
    return {
      tokenId: this.tokenId,
      studentId: this.studentId,
      cardNumber: this.cardNumber,
      ownerAddress: this.ownerAddress,
      metadataUri: this.metadataUri,
      mintedAt: this.mintedAt,
      lastTransferredAt: this.lastTransferredAt,
      mintTxHash: this.mintTxHash,
      status: this.status,
      version: this.version,
      previousVersionId: this.previousVersionId,
      isLatestVersion: this.isLatestVersion,
      fingerprint: this.calculateFingerprint(),
    };
  }
}

module.exports = NFT;
