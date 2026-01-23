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
const studentCreateForm = document.getElementById('studentCreate');
const messageStudentCreate = document.getElementById('messageStudentCreate');

if (studentCreateForm) {
    studentCreateForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const token2 = localStorage.getItem('token');
        if (!token2) {
            messageStudentCreate.textContent = "please login again";
            window.location.href = 'Login.html';  // Redirect to login
            return;
        }
        const studentCreateFirstName = document.getElementById('studentCreateFirstName').value;
        const studentCreateLastName = document.getElementById('studentCreateLastName').value;
        const studentCreateEmail = document.getElementById('studentCreateEmail').value;
        const studentCreateDateOfBirth = document.getElementById('studentCreateDateOfBirth').value;
        const studentCreateGrade = document.getElementById('studentCreateGrade').value;
        try {
            const response = await fetch('http://localhost:8080/api/students', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token2}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: studentCreateFirstName,
                    last_name: studentCreateLastName,
                    email: studentCreateEmail,
                    date_of_birth: studentCreateDateOfBirth,
                    grade: studentCreateGrade
                })
            });
            const data = await response.json();
            if (response.ok) {
                messageStudentCreate.style.color = 'green';
                messageStudentCreate.textContent = 'The student has been created';
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                messageStudentCreate.style.color = 'red';
                messageStudentCreate.textContent = data.message || "unable to create Student";
            }
        } catch (error) {
            messageStudentCreate.style.color = 'red';
            messageStudentCreate.textContent = 'error connecting to the server'
            console.error('fetch error:', error)
        }
    });

}
