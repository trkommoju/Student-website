const pool = require('../config/database');

/**
 * Returns all teachers in the school.
 */
const getAllTeachers = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM teachers'
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Get all teachers error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
const getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM teachers WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'teacher not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Get teacher error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
const getTeacherBySubject = async (req, res) => {
    try {
        const { classType } = req.params;

        const result = await pool.query(
            'SElECT * FROM teachers WHERE subject_name = $1',
            [classType]
        );
        if (result.rows.length == 0) {
            return res.status(404).json({
                success: false,
                message: 'teacher not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Internal server error'
        });
    } catch (error) {
        console.error('Get teacher error: ', error);
        res.status(500).json({
            success: false,
            message: 'internal server error'
        });
    }
}
// POST - Create new student
const createTeacher = async (req, res) => {
    try {
        const { first_name, last_name, email, date_of_birth, subject_name } = req.body;

        // Validation
        if (!first_name || !last_name || !email) {
            return res.status(400).json({
                success: false,
                message: 'First name, last name, and email are required'
            });
        }

        // Check if email already exists
        const emailCheck = await pool.query(
            'SELECT * FROM teachers WHERE email = $1',
            [email]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'teacher with this email already exists'
            });
        }

        // Insert student
        const result = await pool.query(
            'INSERT INTO teachers (first_name, last_name, email, date_of_birth, subject_name) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [first_name, last_name, email, date_of_birth, subject_name]
        );

        res.status(201).json({
            success: true,
            message: 'teacher created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Create teacher error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, date_of_birth, subject_name } = req.body;

        // Validation
        if (!first_name || !last_name || !email) {
            return res.status(400).json({
                success: false,
                message: 'First name, last name, and email are required'
            });
        }

        // Check if student exists
        const teacherCheck = await pool.query(
            'SELECT * FROM teachers WHERE id = $1',
            [id]
        );

        if (teacherCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'teacher not found'
            });
        }

        // Check if email is taken by another student
        const emailCheck = await pool.query(
            'SELECT * FROM teachers WHERE email = $1 AND id != $2',
            [email, id]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email is already taken by another teacher'
            });
        }

        // Update student
        const result = await pool.query(
            'UPDATE teachers SET first_name = $1, last_name = $2, email = $3, date_of_birth = $4, subject_name = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
            [first_name, last_name, email, date_of_birth, subject_name || null, id || null]
        );

        res.status(200).json({
            success: true,
            message: 'teacher updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Update teacher error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if student exists
        const teacherCheck = await pool.query(
            'SELECT * FROM teachers WHERE id = $1',
            [id]
        );

        if (teacherCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'teacher not found'
            });
        }

        // Delete student
        await pool.query('DELETE FROM teachers WHERE id = $1', [id]);

        res.status(200).json({
            success: true,
            message: 'teacher deleted successfully'
        });
    } catch (error) {
        console.error('Delete teacher error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal teacher error'
        });
    }
};

module.exports = {
    getAllTeachers,
    getTeacherById,
    getTeacherBySubject,
    createTeacher,
    updateTeacher,
    deleteTeacher,
}