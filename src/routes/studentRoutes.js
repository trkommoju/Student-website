const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    patchStudent,
    deleteStudent
} = require('../controllers/studentController');

// All student routes are protected with authentication
router.use(authMiddleware);

// GET /api/students - Get all students
router.get('/', getAllStudents);

// GET /api/students/:id - Get single student
router.get('/:id', getStudentById);

// POST /api/students - Create new student
router.post('/', createStudent);

// PUT /api/students/:id - Update entire student record
router.put('/:id', updateStudent);

// PATCH /api/students/:id - Partial update of student record
router.patch('/:id', patchStudent);

// DELETE /api/students/:id - Delete student
router.delete('/:id', deleteStudent);

module.exports = router;
