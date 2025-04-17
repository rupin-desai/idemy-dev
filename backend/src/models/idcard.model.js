class IDCard {
  constructor(studentId, cardNumber, issueDate, expiryDate, cardType, imageUri) {
    this.studentId = studentId;
    this.cardNumber = cardNumber;
    this.issueDate = issueDate;
    this.expiryDate = expiryDate;
    this.cardType = cardType || 'STUDENT';
    this.status = 'ACTIVE';
    this.imageUri = imageUri;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    this.nftVersions = []; // Array of all NFT token IDs (versions)
    this.latestNftTokenId = null; // Reference to the latest NFT version
  }

  linkToNFT(tokenId) {
    if (!this.nftVersions.includes(tokenId)) {
      this.nftVersions.push(tokenId);
    }
    this.latestNftTokenId = tokenId;
    this.updatedAt = Date.now();
  }

  toMetadata(version = 1) {
    return {
      name: `${this.cardType} ID Card - ${this.studentId}`,
      description: `Official ${this.cardType} ID Card for student ${this.studentId}`,
      image: `/api/nft/idcards/${this.studentId}/image?v=${version}`,
      version: version,
      attributes: [
        {
          trait_type: "Card Type",
          value: this.cardType
        },
        {
          trait_type: "Card Number",
          value: this.cardNumber
        },
        {
          trait_type: "Issue Date",
          value: new Date(this.issueDate).toISOString()
        },
        {
          trait_type: "Expiry Date",
          value: new Date(this.expiryDate).toISOString()
        },
        {
          trait_type: "Version",
          value: version.toString()
        },
        {
          trait_type: "Status",
          value: this.status
        }
      ]
    };
  }

  toJSON() {
    return {
      studentId: this.studentId,
      cardNumber: this.cardNumber,
      issueDate: this.issueDate,
      expiryDate: this.expiryDate,
      cardType: this.cardType,
      status: this.status,
      imageUri: this.imageUri,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      nftVersions: this.nftVersions,
      latestNftTokenId: this.latestNftTokenId
    };
  }
}

module.exports = IDCard;
