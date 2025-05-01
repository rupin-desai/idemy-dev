class Student {
  constructor(
    studentId,
    firstName,
    lastName,
    email,
    dateOfBirth,
    additionalInfo = {}
  ) {
    this.studentId = studentId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.dateOfBirth = dateOfBirth || null;
    this.additionalInfo = additionalInfo;
    this.institutionHistory = [];  // New field
    this.currentInstitution = null;  // New field
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }

  update(updates) {
    // Only update allowed fields
    if (updates.firstName) this.firstName = updates.firstName;
    if (updates.lastName) this.lastName = updates.lastName;
    if (updates.email) this.email = updates.email;
    if (updates.dateOfBirth) this.dateOfBirth = updates.dateOfBirth;
    if (updates.additionalInfo) {
      this.additionalInfo = {
        ...this.additionalInfo,
        ...updates.additionalInfo,
      };
    }
    // Add these new lines
    if (updates.institutionHistory) this.institutionHistory = updates.institutionHistory;
    if (updates.currentInstitution !== undefined) this.currentInstitution = updates.currentInstitution;

    this.updatedAt = Date.now();
    return this;
  }

  // Make sure the Student model's toJSON method includes all fields:
  toJSON() {
    return {
      studentId: this.studentId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      dateOfBirth: this.dateOfBirth,
      institution: this.additionalInfo?.institution || null,
      department: this.additionalInfo?.department || null,
      additionalInfo: this.additionalInfo || {},
      institutionHistory: this.institutionHistory || [],
      currentInstitution: this.currentInstitution || null,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

// Add this export statement
module.exports = Student;
