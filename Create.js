
document.addEventListener('DOMContentLoaded', function () {
    const userRole = localStorage.getItem('userRole') || 'student';
    let allData = [];
    const config = {
        student: {
            title: 'Student create',
            createType: 'grade',
            apiEndpoint: '/api/students',
            gradeField: 'grade',
            gradeLabel: 'Grade',
            gradeInputType: 'number',
            gradePlaceHolder: 'Enter the Grade'
        },
        teacher: {
            title: 'teacher create',
            createType: 'class',
            apiEndpoint: '/api/teachers',
            gradeField: 'subject_name',
            gradeLabel: 'Subject',
            gradeInputType: 'text',
            gradePlaceHolder: 'Enter the subject'
        }
    }
    const currentConfig = config[userRole];
    function initializePage() {
        document.getElementById('createTitle').textContent = currentConfig.title;
        document.getElementById('createTypeLabel').textContent = currentConfig.gradeLabel;
        const typeInput = document.getElementById('createType');
        typeInput.type = currentConfig.gradeInputType;
        typeInput.placeholder = currentConfig.gradePlaceHolder;
    }
    initializePage();
    const createForm = document.getElementById('createForm');
    const messageCreate = document.getElementById('messageCreate');

    if (createForm) {
        createForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const token = localStorage.getItem('token');
            if (!token) {
                messageCreate.textContent = "please login again";
                window.location.href = 'Login.html';  // Redirect to login
                return;
            }
            const createFirstName = document.getElementById('createFirstName').value;
            const createLastName = document.getElementById('createLastName').value;
            const createEmail = document.getElementById('createEmail').value;
            const createDateOfBirth = document.getElementById('createDateOfBirth').value;
            const createGrade = document.getElementById('createType').value;
            try {
                const response = await fetch(`http://localhost:8080${currentConfig.apiEndpoint}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        first_name: createFirstName,
                        last_name: createLastName,
                        email: createEmail,
                        date_of_birth: createDateOfBirth,
                        [currentConfig.gradeField]: createGrade
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    messageCreate.style.color = 'green';
                    messageCreate.textContent = `The ${userRole} has been created`;
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    messageCreate.style.color = 'red';
                    messageCreate.textContent = data.message || `unable to create ${userRole}`;
                }
            } catch (error) {
                messageCreate.style.color = 'red';
                messageCreate.textContent = 'error connecting to the server'
                console.error('fetch error:', error)
            }
        });

    }
});