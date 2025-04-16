const studentService = require("../services/student.service");
const authService = require('../services/auth.service');
const idGenerator = require("../utils/idGenerator.utils");
const logger = require("../utils/logger.utils");

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
      const { email, institution, department, enrollmentYear, graduationYear, uid } = req.body;
      
      if (!email || !institution) {
        return res.status(400).json({
          success: false,
          message: 'Email and institution are required'
        });
      }
      
      // Generate student ID using pattern
      const studentId = idGenerator.generateStudentId();
      
      // Create student data object
      const studentData = {
        studentId,
        email,
        firstName: req.body.firstName || '',
        lastName: req.body.lastName || '',
        additionalInfo: {
          institution,
          department: department || '',
          enrollmentYear: enrollmentYear || new Date().getFullYear(),
          graduationYear: graduationYear || new Date().getFullYear() + 4,
          firebaseUid: uid || null,
          role: 'student' // Add role explicitly
        },
        status: 'ACTIVE'
      };
      
      // Create student using service
      const student = await studentService.createStudent(studentData);
      
      // Link student to Firebase user if UID is provided
      if (uid) {
        try {
          // Update Firebase user with student information
          await authService.updateUser(uid, {
            customClaims: { 
              studentId: student.studentId,
              role: 'student'
            }
          });
          logger.info(`Associated student ${studentId} with user ${uid}`);
        } catch (error) {
          logger.error(`Failed to update Firebase user: ${error.message}`);
          // Continue even if Firebase update fails
        }
      }
      
      return res.status(201).json({
        success: true,
        student,
        message: 'Student registered successfully'
      });
    } catch (error) {
      logger.error(`Student registration error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message
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
