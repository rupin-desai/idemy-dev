const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');

// Create a new student
router.post('/', studentController.createStudent);

// Get all students
router.get('/', studentController.getAllStudents);

// Get a specific student by ID
router.get('/:studentId', studentController.getStudent);

// Update a student
router.put('/:studentId', studentController.updateStudent);

// Delete a student
router.delete('/:studentId', studentController.deleteStudent);

// Get student change history
router.get('/:studentId/history', studentController.getStudentHistory);

module.exports = router;