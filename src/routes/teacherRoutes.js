const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    getAllTeachers,
    getTeacherById,
    getTeacherBySubject,
    createTeacher,
    updateTeacher,
    deleteTeacher
} = require('../controllers/teacherController');

router.use(authMiddleware);

router.get('/', getAllTeachers);
router.get('/:id', getTeacherById)
router.get('/:classType', getTeacherBySubject)
router.post('/', createTeacher);
router.put('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);

module.exports = router;



