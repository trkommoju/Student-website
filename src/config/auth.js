const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SALT_ROUNDS = 10;

// Hash password
const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

// Compare password with hash
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
const generateToken = (userId, username) => {
    return jwt.sign(
        { userId, username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// Verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken
};
