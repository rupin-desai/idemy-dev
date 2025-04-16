class IDCard {
  constructor(
    studentId,
    cardNumber,
    issueDate,
    expiryDate,
    cardType,
    imageUri
  ) {
    this.studentId = studentId;
    this.cardNumber = cardNumber;
    this.issueDate = issueDate;
    this.expiryDate = expiryDate;
    this.cardType = cardType; // STUDENT, LIBRARY, ALUMNI, etc.
    this.imageUri = imageUri;
    this.status = "ACTIVE"; // ACTIVE, EXPIRED, REVOKED
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    this.nftTokenId = null;
  }

  linkToNFT(tokenId) {
    this.nftTokenId = tokenId;
    this.updatedAt = Date.now();
  }

  toJSON() {
    return {
      studentId: this.studentId,
      cardNumber: this.cardNumber,
      issueDate: this.issueDate,
      expiryDate: this.expiryDate,
      cardType: this.cardType,
      imageUri: this.imageUri,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      nftTokenId: this.nftTokenId,
    };
  }

  toMetadata() {
    return {
      name: `${this.cardType} ID Card - ${this.studentId}`,
      description: `Official ${this.cardType} ID Card for student ${this.studentId}`,
      image: this.imageUri,
      attributes: [
        { trait_type: "Card Type", value: this.cardType },
        {
          trait_type: "Issue Date",
          value: new Date(this.issueDate).toISOString(),
        },
        {
          trait_type: "Expiry Date",
          value: new Date(this.expiryDate).toISOString(),
        },
        { trait_type: "Status", value: this.status },
      ],
    };
  }
}

module.exports = IDCard;
