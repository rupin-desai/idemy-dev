const studentService = require("../services/student.service");
const authService = require("../services/auth.service");
const idGenerator = require("../utils/idGenerator.utils");
const logger = require("../utils/logger.utils");
const blockchainService = require("../services/blockchain.service"); // Add this import!
const transactionService = require("../services/transaction.service"); // Add this

class StudentController {
  async createStudent(req, res) {
    try {
      const studentData = req.body;

      if (
        !studentData.firstName ||
        !studentData.lastName ||
        !studentData.email
      ) {
        return res.status(400).json({
          success: false,
          message: "First name, last name, and email are required",
        });
      }

      const student = studentService.createStudent(studentData);

      return res.status(201).json({
        success: true,
        message: "Student created successfully",
        student,
      });
    } catch (error) {
      logger.error(`Create student error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getStudent(req, res) {
    try {
      const { studentId } = req.params;

      const student = studentService.getStudentById(studentId);

      return res.status(200).json({
        success: true,
        student,
      });
    } catch (error) {
      logger.error(`Get student error: ${error.message}`);
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllStudents(req, res) {
    try {
      const students = studentService.getAllStudents();

      return res.status(200).json({
        success: true,
        count: students.length,
        students,
      });
    } catch (error) {
      logger.error(`Get all students error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateStudent(req, res) {
    try {
      const { studentId } = req.params;
      const updates = req.body;

      const student = studentService.updateStudent(studentId, updates);

      return res.status(200).json({
        success: true,
        message: "Student updated successfully",
        student,
      });
    } catch (error) {
      logger.error(`Update student error: ${error.message}`);
      return res.status(error.message.includes("not found") ? 404 : 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteStudent(req, res) {
    try {
      const { studentId } = req.params;

      const result = studentService.deleteStudent(studentId);

      return res.status(200).json({
        success: true,
        message: "Student deleted successfully",
        result,
      });
    } catch (error) {
      logger.error(`Delete student error: ${error.message}`);
      return res.status(error.message.includes("not found") ? 404 : 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getStudentHistory(req, res) {
    try {
      const { studentId } = req.params;

      const history = studentService.getStudentHistory(studentId);

      return res.status(200).json({
        success: true,
        studentId,
        count: history.length,
        history,
      });
    } catch (error) {
      logger.error(`Get student history error: ${error.message}`);
      return res.status(error.message.includes("not found") ? 404 : 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async registerStudent(req, res) {
    try {
      const {
        uid,
        email,
        firstName,
        lastName,
        dateOfBirth,
        educationLevel,
        bio,
        skills,
        institution = "Pending",  // Default value since institutions are handled via applications
        department = "Pending",   // Default value
        metadata
      } = req.body;

      if (!email || !institution) {
        return res.status(400).json({
          success: false,
          message: "Email and institution are required",
        });
      }

      // Generate or use provided student ID
      const studentId = req.body.studentId || `STU${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      // Create student data object with all form fields
      const studentData = {
        studentId,
        firstName,
        lastName,
        email,
        dateOfBirth, // Add dateOfBirth as a direct property
        institution,
        department,
        firebaseUid: uid || null,
        role: "student",
        additionalInfo: {
          // Remove dateOfBirth from here
          educationLevel,
          bio,
          skills
        }
      };

      // Create student using service
      const student = await studentService.createStudent(studentData);

      // Create a blockchain transaction with comprehensive metadata
      const transaction = transactionService.createTransaction(
        email,
        'SYSTEM_STUDENT_REGISTRY',
        0,
        {
          type: 'STUDENT_REGISTRATION',
          role: 'student',
          action: 'CREATE',
          studentId: studentId,
          studentData: {
            ...studentData,
            firebaseUid: undefined, // Exclude sensitive data
            additionalInfo: {
              dateOfBirth,
              educationLevel,
              bio,
              skills
            }
          },
          ...(metadata || {})
        }
      );
      
      // Add transaction to blockchain
      transactionService.addTransaction(transaction);

      logger.info(`Student registered and recorded in blockchain: ${studentId}`);

      return res.status(201).json({
        success: true,
        student,
        message: "Student registered successfully",
      });
    } catch (error) {
      logger.error(`Register student error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getStudentById(req, res) {
    try {
      const { id } = req.params;
      const student = await studentService.getStudentById(id);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      return res.status(200).json({
        success: true,
        student,
      });
    } catch (error) {
      logger.error(`Get student error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new StudentController();
