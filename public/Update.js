document.addEventListener('DOMContentLoaded', function () {

    const userRole = localStorage.getItem('userRole') || 'student';
    let allData = [];

    const config = {
        student: {
            title: 'Student Update',
            updateType: 'grade',
            apiEndpoint: "/api/students",
            gradeField: 'grade',
            itemIdKey: 'studentToUpdate',
            gradeLabel: 'Grade',
            gradeInputType: 'number',
            gradePlaceHolder: 'Enter the grade'
        },
        teacher: {
            title: 'Teacher Update',
            updateType: 'Class',
            apiEndpoint: "/api/teachers",
            gradeField: 'subject_name',
            itemIdKey: 'teacherToUpdate',
            gradeLabel: 'Subject',
            gradeInputType: 'text',
            gradePlaceHolder: 'Enter the subject'
        }
    }
    const currentConfig = config[userRole];
    function initializePage() {
        document.getElementById('updateTitle').textContent = currentConfig.title;
        document.getElementById('updateTypeLabel').textContent = currentConfig.gradeLabel;
        const typeInput = document.getElementById('targetUpdateType');
        typeInput.type = currentConfig.gradeInputType;
        typeInput.placeholder = currentConfig.gradePlaceHolder;
    }

    (async function () {
        if (!document.getElementById('updateForm')) return;
        initializePage();
        const token = localStorage.getItem('token');
        const itemToUpdate = localStorage.getItem(currentConfig.itemIdKey);
        const messageUpdate = document.getElementById('messageUpdate');
        if (!token) {
            messageUpdate.textContent = "please login again";
            window.location.href = 'Login.html';
            return;
        }
        if (!itemToUpdate) {
            messageUpdate.style.color = 'red';
            messageUpdate.textContent = "No item selected for update";
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080${currentConfig.apiEndpoint}/${itemToUpdate}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                }
            });

            const data = await response.json();
            if (response.ok) {
                const item = data.data || data;
                document.getElementById('targetUpdateID').value = item.id;
                document.getElementById('targetUpdateFirstName').value = item.first_name;
                document.getElementById('targetUpdateLastName').value = item.last_name;
                document.getElementById('targetUpdateEmail').value = item.email;
                document.getElementById('targetUpdateDateOfBirth').value = item.date_of_birth.split('T')[0] || '';
                document.getElementById('targetUpdateType').value = item[currentConfig.gradeField];

                localStorage.setItem('originalEmail', item.email);
            } else {
                messageUpdate.style.color = 'red';
                messageUpdate.textContent = data.message || `failed to fetch ${userRole}`;
            }

        } catch (error) {
            messageUpdate.style.color = 'red';
            messageUpdate.textContent = 'Error connecting to the server';
            console.error('Fetch error:', error);
        }

    })();
    async function checkEmail(enteredEmail, messageLocation) {
        const token = localStorage.getItem('token');
        const message = messageLocation;
        if (!token) {
            message.textContent = "please login again";
            setTimeout(() => {
                window.location.href = "Login.html";
            }, 1000);
            return false;
        }
        try {
            const response = await fetch(`http://localhost:8080${currentConfig.apiEndpoint}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.ok) {
                const items = data.data || data;
                if (items.some(item => item.email === enteredEmail)) {
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



    const updateForm = document.getElementById('updateForm')
    if (updateForm) {
        updateForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const token = localStorage.getItem('token');
            const messageUpdate = document.getElementById('messageUpdate');
            const originalEmail = localStorage.getItem('originalEmail');
            const newEmail = document.getElementById('targetUpdateEmail').value;

            if (newEmail !== originalEmail) {
                const emailExists = await checkEmail(newEmail, messageUpdate);
                if (!emailExists) {
                    return;
                }
            }
            const updatedItem = {
                id: document.getElementById('targetUpdateID').value,
                first_name: document.getElementById('targetUpdateFirstName').value,
                last_name: document.getElementById('targetUpdateLastName').value,
                email: newEmail,
                date_of_birth: document.getElementById('targetUpdateDateOfBirth').value,
                [currentConfig.gradeField]: document.getElementById('targetUpdateType').value
            };

            try {
                const response = await fetch(`http://localhost:8080${currentConfig.apiEndpoint}/${updatedItem.id}`, {
                    method: 'PUT', // or 'PATCH' depending on your API
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(updatedItem)
                });

                const data = await response.json();

                if (response.ok) {
                    messageUpdate.style.color = 'green';
                    messageUpdate.textContent = `${userRole} updated successfully!`;
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    messageUpdate.style.color = 'red';
                    messageUpdate.textContent = data.message || `Failed to update ${userRole}`;
                }
            } catch (error) {
                messageUpdate.style.color = 'red';
                messageUpdate.textContent = 'Error connecting to the server';
                console.error('Update error:', error);
            }

        });
    }

});