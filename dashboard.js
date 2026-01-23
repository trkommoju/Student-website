const dropMenuID = document.getElementById("dropMenu");

function showMenu() {
    if (dropMenuID) {
        dropMenuID.style.left = "0";
    }
}

function hideMenu() {
    if (dropMenuID) {
        dropMenuID.style.left = "-200px";
    }
}
function displayStudents(students, input) {
    const tableBody = document.getElementById('studentTableBody');
    const searchType = document.getElementById('options').value;  // Get selected option

    if (!students || students.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">No students found.</td></tr>';
        return;
    }

    let searchTerm = input.value.toLowerCase().trim();
    let html = '';
    let foundCount = 0;

    students.forEach(student => {
        if (searchTerm) {
            let matches = false;

            if (searchType === 'Name') {
                matches = student.first_name.toLowerCase().includes(searchTerm) ||
                    student.last_name.toLowerCase().includes(searchTerm);
            } else if (searchType === 'Email') {
                matches = student.email.toLowerCase().includes(searchTerm);
            } else if (searchType === 'Grade') {
                matches = student.grade.toString().toLowerCase().includes(searchTerm);
            }

            if (!matches) {
                return;
            }
        }

        foundCount++;
        html += `
            <tr>
                <td>${student.first_name} ${student.last_name}</td>
                <td>${student.email}</td>
                <td>${student.grade}</td>
                <td><button type="button" onclick="updateStudent(${student.id})" class="buttonUpdate">Update</button></td>
                <td><button type="button" onclick="deleteStudent(${student.id})" class="deleteStudent">Delete</button></td>
            </tr>
        `;
    });

    if (!foundCount && searchTerm) {
        tableBody.innerHTML = '<tr><td colspan="6">No students found matching your search.</td></tr>';
    } else {
        tableBody.innerHTML = html;
    }
}
let allStudents = [];
(async function () {
    const tableBody = document.getElementById('studentTableBody');
    if (!tableBody) return;

    const token = localStorage.getItem('token');
    const messageDashboard = document.getElementById('messageDashboard');

    if (!token) {
        messageDashboard.textContent = "please login again";
        window.location.href = 'Login.html';
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
            allStudents = data.data || data;
            const dummyInput = { value: '' };
            displayStudents(allStudents, dummyInput);
        } else {
            messageDashboard.style.color = 'red';
            messageDashboard.textContent = data.message || "Failed to fetch students";
        }
    } catch (error) {
        messageDashboard.style.color = 'red';
        messageDashboard.textContent = 'Error connecting to server';
        console.error('Fetch error:', error);
    }
})();

const searchInput = document.getElementById('searchInput');
const searchType = document.getElementById('searchType');

if (searchInput) {
    searchInput.addEventListener('input', function () {
        displayStudents(allStudents, searchInput);
    });
}

if (searchType) {
    searchType.addEventListener('change', function () {
        displayStudents(allStudents, searchInput);
    });
}


(async function () {
    if (!document.getElementById('studentUpdateID')) return;
    const token = localStorage.getItem('token');
    const studentToUpdate = localStorage.getItem('studentToUpdate');
    const messageStudentUpdate = document.getElementById('messageStudentUpdate');
    if (!token) {
        messageStudentUpdate.textContent = "please login again";
        window.location.href = 'Login.html';
        return;
    }
    try {
        const response = await fetch(`http://localhost:8080/api/students/${studentToUpdate}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
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
            document.getElementById('studentUpdateDateOfBirth').value = student.date_of_birth.split('T')[0] || '';
            document.getElementById('studentUpdateGrade').value = student.grade;

            localStorage.setItem('originalEmail', student.email);
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

window.updateStudent = function (id) {
    localStorage.setItem('studentToUpdate', id);
    window.location.href = "studentUpdate.html";
}

window.deleteStudent = function (id) {
    if (confirm('Are you sure you want to delete this student?')) {
        deleteStudentById(id);
    }
}

