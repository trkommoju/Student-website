const pool = require('../config/database');

// GET all students
const getAllStudents = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM students ORDER BY created_at DESC'
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Get all students error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// GET single student by ID
const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM students WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Get student error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// POST - Create new student
const createStudent = async (req, res) => {
    try {
        const { first_name, last_name, email, date_of_birth, grade } = req.body;

        // Validation
        if (!first_name || !last_name || !email) {
            return res.status(400).json({
                success: false,
                message: 'First name, last name, and email are required'
            });
        }

        // Check if email already exists
        const emailCheck = await pool.query(
            'SELECT * FROM students WHERE email = $1',
            [email]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Student with this email already exists'
            });
        }

        // Insert student
        const result = await pool.query(
            'INSERT INTO students (first_name, last_name, email, date_of_birth, grade) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [first_name, last_name, email, date_of_birth || null, grade || null]
        );

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Create student error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// PUT - Update entire student record
const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, date_of_birth, grade } = req.body;

        // Validation
        if (!first_name || !last_name || !email) {
            return res.status(400).json({
                success: false,
                message: 'First name, last name, and email are required'
            });
        }

        // Check if student exists
        const studentCheck = await pool.query(
            'SELECT * FROM students WHERE id = $1',
            [id]
        );

        if (studentCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Check if email is taken by another student
        const emailCheck = await pool.query(
            'SELECT * FROM students WHERE email = $1 AND id != $2',
            [email, id]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email is already taken by another student'
            });
        }

        // Update student
        const result = await pool.query(
            'UPDATE students SET first_name = $1, last_name = $2, email = $3, date_of_birth = $4, grade = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
            [first_name, last_name, email, date_of_birth || null, grade || null, id]
        );

        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// PATCH - Partial update of student record
const patchStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Check if student exists
        const studentCheck = await pool.query(
            'SELECT * FROM students WHERE id = $1',
            [id]
        );

        if (studentCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // If email is being updated, check if it's taken
        if (updates.email) {
            const emailCheck = await pool.query(
                'SELECT * FROM students WHERE email = $1 AND id != $2',
                [updates.email, id]
            );

            if (emailCheck.rows.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'Email is already taken by another student'
                });
            }
        }

        // Build dynamic update query
        const allowedFields = ['first_name', 'last_name', 'email', 'date_of_birth', 'grade'];
        const updateFields = [];
        const values = [];
        let paramCount = 1;

        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key)) {
                updateFields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }

        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        const query = `UPDATE students SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        const result = await pool.query(query, values);

        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Patch student error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// DELETE - Delete student
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if student exists
        const studentCheck = await pool.query(
            'SELECT * FROM students WHERE id = $1',
            [id]
        );

        if (studentCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Delete student
        await pool.query('DELETE FROM students WHERE id = $1', [id]);

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    patchStudent,
    deleteStudent
};
