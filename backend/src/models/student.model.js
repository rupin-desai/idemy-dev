class Student {
  constructor(studentId, firstName, lastName, email, additionalInfo = {}) {
    this.studentId = studentId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.additionalInfo = additionalInfo;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }

  update(updates) {
    // Only update allowed fields
    if (updates.firstName) this.firstName = updates.firstName;
    if (updates.lastName) this.lastName = updates.lastName;
    if (updates.email) this.email = updates.email;
    if (updates.additionalInfo) {
      this.additionalInfo = {
        ...this.additionalInfo,
        ...updates.additionalInfo
      };
    }
    this.updatedAt = Date.now();
    return this;
  }

  toJSON() {
    return {
      studentId: this.studentId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      additionalInfo: this.additionalInfo,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Student;