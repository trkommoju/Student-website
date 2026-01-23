const studentUpdateForm = document.getElementById('studentUpdate')
if (studentUpdateForm) {
    studentUpdateForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const messageStudentUpdate = document.getElementById('messageStudentUpdate');
        const originalEmail = localStorage.getItem('originalEmail');
        const newEmail = document.getElementById('studentUpdateEmail').value;

        if (newEmail !== originalEmail) {
            const emailExists = await checkEmail(newEmail, messageStudentUpdate);
            if (!emailExists) {
                return;
            }
        }
        const updatedStudent = {
            id: document.getElementById('studentUpdateID').value,
            first_name: document.getElementById('studentUpdateFirstName').value,
            last_name: document.getElementById('studentUpdateLastName').value,
            email: newEmail,
            date_of_birth: document.getElementById('studentUpdateDateOfBirth').value,
            grade: document.getElementById('studentUpdateGrade').value
        };

        try {
            const response = await fetch(`http://localhost:8080/api/students/${updatedStudent.id}`, {
                method: 'PUT', // or 'PATCH' depending on your API
                headers: {
                    'Authorization': `Bearer ${token}`,
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
                return false;
            }
        } catch (error) {
            messageDashboard.style.color = 'red';
            messageDashboard.textContent = 'error connecting to the server';
            console.error('fetch error:', error)
            return false;
        }
    })();
}

async function checkEmail(enteredEmail, messageLocation) {
    const token = localStorage.getItem('token');
    const message = messageLocation;
    if (!token) {
        message.textContent = "please login again";
        setTimeout(() => {
            window.location.href = "Login.html";
        }, 1000);
        return;
    }
    try {
        const response = await fetch('http://localhost:8080/api/students', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json'
            }
        });
        const data = await response.json();
        if (response.ok) {
            const students = data.data || data;
            if (students.some(student => student.email === enteredEmail)) {
                message.style.color = 'red';
                message.textContent = 'Please use another email';
                return false;
            }
            return true;
        } else {
            message.style.color = 'red';
            message.textContent = data.message || 'there was an error';
            return false;
        }
    } catch (error) {
        message.style.color = 'red';
        message.textContent = 'there was an error connecting to the server';
        return false;
    }
}


