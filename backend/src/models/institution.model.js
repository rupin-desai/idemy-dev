class Institution {
  constructor(
    institutionId,
    name,
    email,
    location,
    institutionType,
    foundingYear,
    website,
    contactInfo
  ) {
    this.institutionId = institutionId || require('../utils/idGenerator.utils').generateInstitutionId();
    this.name = name;
    this.email = email;
    this.location = location || '';
    this.institutionType = institutionType || 'University'; // University, College, School, etc.
    this.foundingYear = foundingYear || new Date().getFullYear();
    this.website = website || '';
    this.contactInfo = contactInfo || {};
    this.status = "PENDING"; // PENDING, ACTIVE, INACTIVE
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    this.nftTokenId = null; // Will be linked to institution NFT
    this.verifiedStudents = []; // List of verified student IDs
  }

  update(updates) {
    // Update institution fields
    if (updates.name) this.name = updates.name;
    if (updates.email) this.email = updates.email;
    if (updates.location) this.location = updates.location;
    if (updates.institutionType) this.institutionType = updates.institutionType;
    if (updates.foundingYear) this.foundingYear = updates.foundingYear;
    if (updates.website) this.website = updates.website;
    if (updates.contactInfo) this.contactInfo = { ...this.contactInfo, ...updates.contactInfo };
    if (updates.status) this.status = updates.status;
    this.updatedAt = Date.now();
    return this;
  }

  linkToNFT(tokenId) {
    this.nftTokenId = tokenId;
    this.updatedAt = Date.now();
  }

  verifyStudent(studentId) {
    if (!this.verifiedStudents.includes(studentId)) {
      this.verifiedStudents.push(studentId);
      this.updatedAt = Date.now();
    }
  }

  toJSON() {
    return {
      institutionId: this.institutionId,
      name: this.name,
      email: this.email,
      location: this.location,
      institutionType: this.institutionType,
      foundingYear: this.foundingYear,
      website: this.website,
      contactInfo: this.contactInfo,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      nftTokenId: this.nftTokenId,
      verifiedStudents: this.verifiedStudents,
    };
  }
}
  
module.exports = Institution;