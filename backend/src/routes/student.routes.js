const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { authenticateToken, bypassAuthForAdmin } = require('../middleware/auth.middleware');

// Use the bypass middleware for development in addition to standard auth
const authMiddleware = process.env.NODE_ENV === 'development' 
  ? [bypassAuthForAdmin]
  : [authenticateToken];

// Public endpoint for student registration
router.post('/register', studentController.registerStudent);

// Protected routes with authentication
// Get all students
router.get('/', authenticateToken, studentController.getAllStudents);

// Get a specific student by ID
router.get('/:studentId', authenticateToken, studentController.getStudent);

// Create a new student (admin route)
router.post('/', authenticateToken, studentController.createStudent);

// Update a student
router.put('/:studentId', authenticateToken, studentController.updateStudent);

// Delete a student
router.delete('/:studentId', authenticateToken, studentController.deleteStudent);

// Get student change history
router.get('/:studentId/history', authenticateToken, studentController.getStudentHistory);

// Get student profile endpoint
router.get('/:id/profile', authenticateToken, studentController.getStudentById);

module.exports = router;