const pool = require('../config/database');
const { hashPassword, comparePassword, generateToken } = require('../config/auth');

// Signup endpoint
const signup = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Validation
        if (!email || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email, username, and password are required'
            });
        }

        // Check if user already exists
        const userCheck = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (userCheck.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Insert user
        const result = await pool.query(
            'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, email, username, created_at',
            [email, username, hashedPassword]
        );

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Login endpoint
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Find user
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        const user = result.rows[0];

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // Generate token
        const token = generateToken(user.id, user.username);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                expiresIn: process.env.JWT_EXPIRES_IN,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    signup,
    login
};
