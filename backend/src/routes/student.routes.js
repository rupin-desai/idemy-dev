const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public endpoint for student registration
router.post('/register', studentController.registerStudent);

// Protected routes with authentication
// Get all students
router.get('/', authMiddleware.authenticate, studentController.getAllStudents);

// Get a specific student by ID
router.get('/:studentId', authMiddleware.authenticate, studentController.getStudent);

// Create a new student (admin route)
router.post('/', authMiddleware.authenticate, studentController.createStudent);

// Update a student
router.put('/:studentId', authMiddleware.authenticate, studentController.updateStudent);

// Delete a student
router.delete('/:studentId', authMiddleware.authenticate, studentController.deleteStudent);

// Get student change history
router.get('/:studentId/history', authMiddleware.authenticate, studentController.getStudentHistory);

// Get student profile endpoint
router.get('/:id/profile', authMiddleware.authenticate, studentController.getStudentById);

module.exports = router;