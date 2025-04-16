const fs = require('fs');
const path = require('path');
const Student = require('../models/student.model');
const transactionService = require('./transaction.service');
const blockchainService = require('./blockchain.service');
const idGenerator = require('../utils/idGenerator.utils');
const logger = require('../utils/logger.utils');

class StudentService {
  constructor() {
    this.dataDir = path.join(__dirname, "../../data");
    this.studentsFile = path.join(this.dataDir, "students.json");
    this.students = new Map();
    this.loadStudents();
  }

  loadStudents() {
    try {
      if (fs.existsSync(this.studentsFile)) {
        const data = fs.readFileSync(this.studentsFile, 'utf8');
        const studentsArray = JSON.parse(data);
        
        studentsArray.forEach(studentData => {
          const student = new Student(
            studentData.studentId,
            studentData.firstName,
            studentData.lastName,
            studentData.email,
            studentData.additionalInfo
          );
          student.createdAt = studentData.createdAt;
          student.updatedAt = studentData.updatedAt;
          this.students.set(studentData.studentId, student);
        });
        
        logger.info(`Loaded ${this.students.size} students from file`);
      } else {
        logger.info('No students file found. Starting with empty students database.');
      }
    } catch (error) {
      logger.error(`Failed to load students: ${error.message}`);
    }
  }

  saveStudents() {
    try {
      const studentsArray = Array.from(this.students.values()).map(student => student.toJSON());
      fs.writeFileSync(this.studentsFile, JSON.stringify(studentsArray, null, 2));
      logger.info('Students saved to file successfully');
      return true;
    } catch (error) {
      logger.error(`Failed to save students: ${error.message}`);
      return false;
    }
  }

  generateStudentId() {
    return idGenerator.generateStudentId();
  }

  getStudentById(studentId) {
    const student = this.students.get(studentId);
    if (!student) {
      throw new Error(`Student with ID ${studentId} not found`);
    }
    return student;
  }

  getAllStudents() {
    return Array.from(this.students.values());
  }

  createStudent(studentData) {
    try {
      // Generate a new student ID if not provided
      const studentId = studentData.studentId || this.generateStudentId();
      
      // Check if student ID already exists
      if (this.students.has(studentId)) {
        throw new Error(`Student ID ${studentId} already exists`);
      }
      
      // Create new student
      const student = new Student(
        studentId,
        studentData.firstName,
        studentData.lastName,
        studentData.email,
        studentData.additionalInfo
      );
      
      // Add to collection
      this.students.set(studentId, student);
      
      // Save to file
      this.saveStudents();
      
      // Record creation in blockchain
      this.recordStudentChange(student, 'CREATE');
      
      return student;
    } catch (error) {
      logger.error(`Create student error: ${error.message}`);
      throw error;
    }
  }

  updateStudent(studentId, updates) {
    try {
      const student = this.getStudentById(studentId);
      
      // Store previous state for the blockchain record
      const previousState = { ...student.toJSON() };
      
      // Update student
      student.update(updates);
      
      // Save to file
      this.saveStudents();
      
      // Record update in blockchain
      this.recordStudentChange(student, 'UPDATE', previousState);
      
      return student;
    } catch (error) {
      logger.error(`Update student error: ${error.message}`);
      throw error;
    }
  }

  deleteStudent(studentId) {
    try {
      const student = this.getStudentById(studentId);
      
      // Remove from collection
      this.students.delete(studentId);
      
      // Save to file
      this.saveStudents();
      
      // Record deletion in blockchain
      this.recordStudentChange(student, 'DELETE');
      
      return { success: true, studentId };
    } catch (error) {
      logger.error(`Delete student error: ${error.message}`);
      throw error;
    }
  }

  recordStudentChange(student, action, previousState = null) {
    try {
      // Create metadata for the transaction
      const metadata = {
        action,
        studentId: student.studentId,
        studentData: student.toJSON(),
        previousState,
        timestamp: Date.now()
      };
      
      // Create a special transaction to record student data change
      // Use a designated system address as both sender and receiver
      const systemAddress = "SYSTEM_STUDENT_REGISTRY";
      
      // Create and add the transaction (with 0 amount since it's just for record-keeping)
      const transaction = transactionService.createTransaction(
        systemAddress, 
        systemAddress, 
        0,
        metadata
      );
      
      // Add transaction to pending transactions
      transactionService.addTransaction(transaction);
      
      logger.info(`Student ${action} recorded in blockchain for ${student.studentId}`);
      return transaction;
    } catch (error) {
      logger.error(`Failed to record student change in blockchain: ${error.message}`);
      // We don't throw here to avoid disrupting the main flow if blockchain recording fails
      return null;
    }
  }

  getStudentHistory(studentId) {
    try {
      // First check if student exists
      this.getStudentById(studentId);
      
      // Get all transactions related to this student ID
      const transactions = blockchainService.getTransactionsByStudentId(studentId);
      
      // Transform transactions to a more readable format
      const history = transactions.map(tx => ({
        action: tx.metadata.action,
        timestamp: tx.timestamp,
        blockIndex: tx.blockIndex,
        studentData: tx.metadata.studentData,
        previousState: tx.metadata.previousState
      }));
      
      return history.sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first
    } catch (error) {
      logger.error(`Get student history error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new StudentService();