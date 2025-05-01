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
    this.cardType = cardType || "STUDENT";
    this.status = "ACTIVE";
    this.imageUri = imageUri;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    this.nftVersions = []; // Array of all NFT token IDs (versions)
    this.latestNftTokenId = null; // Reference to the latest NFT version

    // New fields for institution verification
    this.verificationStatus = "UNVERIFIED"; // UNVERIFIED, VERIFIED
    this.verifiedInstitution = null;
    this.verifiedInstitutionId = null;
    this.verificationData = null;
    this.verifiedAt = null;
  }

  linkToNFT(tokenId) {
    if (!this.nftVersions.includes(tokenId)) {
      this.nftVersions.push(tokenId);
    }
    this.latestNftTokenId = tokenId;
    this.updatedAt = Date.now();
  }

  setVerification(institutionId, institutionName, verificationData) {
    this.verificationStatus = "VERIFIED";
    this.verifiedInstitution = institutionName;
    this.verifiedInstitutionId = institutionId;
    this.verificationData = verificationData;
    this.verifiedAt = Date.now();
    this.updatedAt = Date.now();
  }

  toMetadata(version = 1, verificationData = null) {
    const metadata = {
      name: `STUDENT ID Card - ${this.studentId}`,
      description: `Official STUDENT ID Card for student ${this.studentId}`,
      image: this.imageUri + (version > 1 ? `?v=${version}` : ""),
      attributes: [
        {
          trait_type: "Card Type",
          value: this.cardType,
        },
        {
          trait_type: "Card Number",
          value: this.cardNumber,
        },
        {
          trait_type: "Issue Date",
          value: new Date(this.issueDate).toISOString(),
        },
        {
          trait_type: "Expiry Date",
          value: new Date(this.expiryDate).toISOString(),
        },
        {
          trait_type: "Status",
          value: this.status,
        },
      ],
    };

    if (version > 1) {
      metadata.version = version;
      metadata.attributes.push({
        trait_type: "Version",
        value: version.toString(),
      });
    }

    // Add verification information if available
    if (this.verificationStatus === "VERIFIED" || verificationData) {
      const data = verificationData || this.verificationData;
      
      metadata.attributes.push({
        trait_type: "Verification Status",
        value: "VERIFIED",
      });

      metadata.attributes.push({
        trait_type: "Verified Institution",
        value: this.verifiedInstitution,
      });

      // Add institution ID for blockchain verification
      metadata.attributes.push({
        trait_type: "Institution ID",
        value: this.verifiedInstitutionId,
      });

      metadata.attributes.push({
        trait_type: "Program",
        value: data?.program || "General Program",
      });

      if (data?.admissionDate) {
        metadata.attributes.push({
          trait_type: "Admission Date",
          value: data.admissionDate,
        });
      }
      
      if (this.verifiedAt) {
        metadata.attributes.push({
          trait_type: "Verification Date",
          value: new Date(this.verifiedAt).toISOString(),
        });
      }
    }

    return metadata;
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
      latestNftTokenId: this.latestNftTokenId,
      verificationStatus: this.verificationStatus,
      verifiedInstitution: this.verifiedInstitution,
      verifiedInstitutionId: this.verifiedInstitutionId,
      verificationData: this.verificationData,
      verifiedAt: this.verifiedAt,
    };
  }
}

module.exports = IDCard;
