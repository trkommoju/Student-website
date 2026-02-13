//const { response } = require("express");

function Person(name, password) {
    this.name = name;
    this.password = password;
}

// API endpoint
const API_URL = 'http://localhost:8080/api/auth';

// Sign up form
const signupForm = document.getElementById('signupForm');
const messageSignup = document.getElementById('messageSignup');

function logout() {
    localStorage.removeItem('token');
    window.location.href = "Login.html";
}

if (signupForm) {
    signupForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('newEmail').value;
        const username = document.getElementById('newName').value;
        const password = document.getElementById('newPassword').value;

        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                messageSignup.style.color = 'green';
                messageSignup.textContent = "Signed up successfully! Return to login page.";
                signupForm.reset();
            } else {
                messageSignup.style.color = 'red';
                messageSignup.textContent = data.message || "User already exists";
            }
        } catch (error) {
            messageSignup.style.color = 'red';
            messageSignup.textContent = "Error connecting to server";
            console.error('Signup error:', error);
        }
    });
}

// Login form
const loginForm = document.getElementById('loginForm');
const messageLogin = document.getElementById('messageLogin');

if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const enteredName = document.getElementById('name').value;
        const enteredPassword = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: enteredName,  // Fixed: was "name", now "username"
                    password: enteredPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                messageLogin.style.color = 'green';
                messageLogin.textContent = "Logged in successfully!";
                // Store token from correct path in response
                if (data.data && data.data.token) {
                    localStorage.setItem('token', data.data.token);
                }
                // Redirect after successful login
                window.location.href = 'dashboard.html';

            } else {
                messageLogin.style.color = 'red';
                messageLogin.textContent = data.message || "Invalid credentials";
            }
        } catch (error) {
            messageLogin.style.color = 'red';
            messageLogin.textContent = "Error connecting to server";
            console.error('Login error:', error);
        }
    });
}
