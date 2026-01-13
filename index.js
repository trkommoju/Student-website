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
/*
// studentRetrieve form
const studentRetrieveForm = document.getElementById('studentRetrieve');
const messageStudentRetrieve = document.getElementById('messageStudentRetrieve');

if (studentRetrieveForm) {
    studentRetrieveForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            messageStudentRetrieve.textContent = "please login again";
            window.location.href = 'Login.html';  // Redirect to login
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/students', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (response.ok) {
                messageStudentRetrieve.style.color = 'green';
                messageStudentRetrieve.textContent = `Found ${data.data ? data.data.length : data.length} students`;
                displayStudents(data.data || data)
            }
            else {
                messageStudentRetrieve.style.color = 'red';
                messageStudentRetrieve.textContent = data.message || "Failed to fetch students";

            }
        } catch (error) {
            messageStudentRetrieve.style.color = 'red';
            messageStudentRetrieve.textContent = 'error connecting to the server'
            console.error('fetch error:', error)
        }
    });
}

function displayStudents(students) {
    if (!students || students.length === 0) {
        messageStudentRetrieve.innerHTML += '<p>No students found.</p>'
        return
    }

    let html = '<h2>Students List:</h2><ul>';

    students.forEach(student => {
        html += `
            <li>
                <strong>${student.first_name} ${student.last_name}</strong><br>
                Email: ${student.email}<br>
                Grade: ${student.grade}<br>
                Id: ${student.id}<br>
                <br>
            </li>
        `;
    });

    html += '</ul>';
    messageStudentRetrieve.innerHTML += html;
}
*/

// create Students
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
/*    
//update Student
const studentUpdateForm = document.getElementById('studentUpdate');
const messageStudentUpdate = document.getElementById('messageStudentUpdate');

if (studentUpdateForm) {
    studentUpdateForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const token3 = localStorage.getItem('token');
        if (!token3) {
            messageStudentUpdate.textContent = "please login again";
            window.location.href = 'Login.html';  // Redirect to login
            return;
        }
        const studentUpdateID = document.getElementById('studentUpdateID').value;
        const studentUpdateFirstName = document.getElementById('studentUpdateFirstName').value;
        const studentUpdateLastName = document.getElementById('studentUpdateLastName').value;
        const studentUpdateEmail = document.getElementById('studentUpdateEmail').value;
        const studentUpdateDateOfBirth = document.getElementById('studentUpdateDateOfBirth').value;
        const studentUpdateGrade = document.getElementById('studentUpdateGrade').value;
        try {
            const response = await fetch(`http://localhost:8080/api/students/${studentUpdateID}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token3}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: studentUpdateFirstName,
                    last_name: studentUpdateLastName,
                    email: studentUpdateEmail,
                    date_of_birth: studentUpdateDateOfBirth,
                    grade: studentUpdateGrade
                })
            });
            const data = await response.json();
            if (response.ok) {
                messageStudentUpdate.style.color = 'green';
                messageStudentUpdate.textContent = 'The student has been updated';
            } else {
                messageStudentUpdate.style.color = 'red';
                messageStudentUpdate.textContent = data.message || "unable to update Student";
            }
        } catch (error) {
            messageStudentUpdate.style.color = 'red';
            messageStudentUpdate.textContent = 'error connecting to the server'
            console.error('fetch error:', error)
        }
    });

}
*/
//student partial update
const studentUpdatePartialForm = document.getElementById('studentUpdatePartial');
const messageStudentUpdatePartial = document.getElementById('messageStudentUpdatePartial');

if (studentUpdatePartialForm) {
    studentUpdatePartialForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const token4 = localStorage.getItem('token');
        if (!token4) {
            messageStudentUpdatePartial.textContent = 'login again';
            window.location.href = 'Login.html';
            return;
        }
        const studentUpdatePartialID = document.getElementById('studentUpdatePartialID').value;
        const studentUpdatePartialGrade = document.getElementById('studentUpdatePartialGrade').value;

        try {
            const response = await fetch(`http://localhost:8080/api/students/${studentUpdatePartialID}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token4}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    grade: studentUpdatePartialGrade
                })
            });

            const data = await response.json();

            if (response.ok) {
                messageStudentUpdatePartial.style.color = 'green';
                messageStudentUpdatePartial.textContent = 'Student has been updated';
            } else {
                messageStudentUpdatePartial.style.color = 'red';
                messageStudentUpdatePartial.textContent = data.message || 'student has not been updated';
            }
        } catch (error) {
            messageStudentUpdatePartial.style.color = 'red';
            messageStudentUpdatePartial.textContent = 'error connecting to the server';
            console.error('fetch error:', error)
        }

    })
}
/*
//Delete students
const studentDeleteForm = document.getElementById('studentDelete');
const messageStudentDelete = document.getElementById('messageStudentDelete');

if (studentDeleteForm) {
    studentDeleteForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const token5 = localStorage.getItem('token');
        if (!token5) {
            messageStudentDelete.textContent = 'login again';
            window.location.href = 'Login.html';
            return;
        }
        const studentDeleteID = document.getElementById('studentDeleteID').value;

        try {
            const response = await fetch(`http://localhost:8080/api/students/${studentDeleteID}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token5}`,
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();

            if (response.ok) {
                messageStudentDelete.style.color = 'green';
                messageStudentDelete.textContent = 'Student has been deleted';
            } else {
                messageStudentDelete.style.color = 'red';
                messageStudentDelete.textContent = data.message || 'Student does not exist';
            }
        } catch (error) {
            messageStudentDelete.style.color = 'red';
            messageStudentDelete.textContent = 'error connecting to the server';
            console.error('fetch error:', error)
        }

    })
}
*/


if (window.location.pathname.includes('dashboard.html')) {
    (async function () {
        const token6 = localStorage.getItem('token');
        const messageDashboard = document.getElementById('messageDashboard')
        if (!token6) {
            messageDashboard.textContent = "please login again";
            window.location.href = 'Login.html';
        }
        try {
            const response = await fetch('http://localhost:8080/api/students', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token6}`,
                    'Content-type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.ok) {
                /*messageDashboard.style.color = "green";
                messageDashboard.textContent = `Found ${data.data ? data.data.length : data.length} students`;*/
                displayStudents(data.data || data)
            }
            else {
                messageDashboard.style.color = 'red';
                messageDashboard.textContent = data.message || "Failed to fetch students";
            }
        } catch (error) {
            messageDashboard.style.color = 'red';
            messageDashboard.textContent = 'error connecting to the server'
            console.error('fetch error:', error)
        }
    })();
}

function displayStudents(students) {
    const tableBody = document.getElementById('studentTableBody');

    if (!students || students.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No students found.</td></tr>';
        return;
    }

    let html = '';
    students.forEach(student => {
        html += `
            <tr>
                <td>${student.first_name} ${student.last_name}</td>
                <td>${student.email}</td>
                <td>${student.grade}</td>
                <td>${student.id}</td>
                <td><button type="button" onclick="updateStudent(${student.id})" class ="buttonUpdate">Update</button></td>
                <td><button type="button" onclick="deleteStudent(${student.id})" class ="deleteStudent">Delete</button></td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

window.updateStudent = function (id) {
    localStorage.setItem('studentToUpdate', id);
    window.location.href = "studentUpdate.html";
}

window.deleteStudent = function (id) {
    if (confirm('Are you sure you want to delete this student?')) {
        deleteStudentById(id);
    }
}
if (window.location.pathname.includes('studentUpdate.html')) {
    (async function () {
        const token7 = localStorage.getItem('token');
        const studentToUpdate = localStorage.getItem('studentToUpdate');
        const messageStudentUpdate = document.getElementById('messageStudentUpdate');
        if (!token7) {
            messageStudentUpdate.textContent = "please login again";
            window.location.href = 'Login.html';
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/students/${studentToUpdate}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token7}`,
                    'Content-type': 'application/json'
                }
            });

            const data = await response.json();
            if (response.ok) {
                const student = data.data || data;
                document.getElementById('studentUpdateID').value = student.id;
                document.getElementById('studentUpdateFirstName').value = student.first_name;
                document.getElementById('studentUpdateLastName').value = student.last_name;
                document.getElementById('studentUpdateEmail').value = student.email;
                document.getElementById('studentUpdateDateOfBirth').value = student.date_of_birth || '';
                document.getElementById('studentUpdateGrade').value = student.grade;
            } else {
                messageStudentUpdate.style.color = 'red';
                messageStudentUpdate.textContent = data.message || 'failed to fetch student';
            }

        } catch (error) {
            messageStudentUpdate.style.color = 'red';
            messageStudentUpdate.textContent = 'Error connecting to the server';
            console.error('Fetch error:', error);
        }

    })()

    document.getElementById('studentUpdate').addEventListener('submit', async function (e) {
        e.preventDefault();
        const token7 = localStorage.getItem('token');
        const messageStudentUpdate = document.getElementById('messageStudentUpdate');

        const updatedStudent = {
            id: document.getElementById('studentUpdateID').value,
            first_name: document.getElementById('studentUpdateFirstName').value,
            last_name: document.getElementById('studentUpdateLastName').value,
            email: document.getElementById('studentUpdateEmail').value,
            date_of_birth: document.getElementById('studentUpdateDateOfBirth').value,
            grade: document.getElementById('studentUpdateGrade').value
        };

        try {
            const response = await fetch(`http://localhost:8080/api/students/${updatedStudent.id}`, {
                method: 'PUT', // or 'PATCH' depending on your API
                headers: {
                    'Authorization': `Bearer ${token7}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(updatedStudent)
            });

            const data = await response.json();

            if (response.ok) {
                messageStudentUpdate.style.color = 'green';
                messageStudentUpdate.textContent = 'Student updated successfully!';
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                messageStudentUpdate.style.color = 'red';
                messageStudentUpdate.textContent = data.message || 'Failed to update student';
            }
        } catch (error) {
            messageStudentUpdate.style.color = 'red';
            messageStudentUpdate.textContent = 'Error connecting to the server';
            console.error('Update error:', error);
        }

    })
}

window.deleteStudent = function (id) {
    if (confirm('Are you sure you want to delete this student?')) {
        deleteStudentById(id);
    }
}

function deleteStudentById(id) {
    (async function () {
        const token = localStorage.getItem('token')
        const messageDashboard = document.getElementById('messageDashboard')
        if (!token) {
            messageDashboard.textContent = 'please login again';
            window.location.href = 'Login.html';
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/students/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();

            if (response.ok) {
                messageDashboard.style.color = 'green';
                messageDashboard.textContent = 'the student has been deleted';
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                messageDashboard.style.color = 'red';
                messageDashboard.textContent = data.message || 'there has been an error';
            }
        } catch (error) {
            messageDashboard.style.color = 'red';
            messageDashboard.textContent = 'error connecting to the server';
            console.error('fetch error:', error)
        }
    })();
}

