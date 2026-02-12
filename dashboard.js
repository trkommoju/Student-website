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

const userRole = localStorage.getItem('userRole') || 'student';
let allData = [];

const config = {
    student: {
        title: "Student Admin",
        listTitle: "Student list",
        apiEndpoint: "/api/students",
        tableClass: "student-table",
        searchOptions: ['Name', 'Email', 'Grade'],
        tableHolders: ['student Name', 'Student Email', 'Student Grade', 'Student Update', 'Student Delete'],
        createPageLink: 'create.html',
        updatePageLink: 'studentUpdate.html',
        switchToLink: 'dashBoard.html',
        switchToText: 'Switch To Teachers',
        itemIdKey: 'studentToUpdate',
        messageId: 'messageDashboard',
        hasGrade: true,
        gradeField: 'grade'
    },
    teacher: {
        title: 'Teacher Admin',
        listTitle: 'Teacher List',
        apiEndpoint: '/api/teachers',
        tableClass: 'teacher-table',
        searchOptions: ['Name', 'Email', 'Class'],
        tableHolders: ['Teacher Name', 'Teacher Email', 'Teacher Subject', 'Teacher Update', 'Teacher Delete'],
        createPageLink: 'create.html',
        updatePageLink: 'studentUpdate.html',
        switchToLink: 'dashboard.html',
        switchToText: 'Switch To Students',
        itemIdKey: 'teacherToUpdate',
        messageId: 'messageTeacherDashboard',
        hasGrade: true,
        gradeField: 'subject_name'
    }
}
window.switchToRole = function (newRole) {
    localStorage.setItem('userRole', newRole);
    window.location.reload();
}
const currentConfig = config[userRole];
function initializePage() {
    document.getElementById('dashboardTitle').textContent = currentConfig.title;
    document.getElementById('listTitle').textContent = currentConfig.listTitle;

    document.getElementById('dataTable').className = currentConfig.tableClass;
    const targetRole = userRole === 'student' ? 'teacher' : 'student';
    const menuItems = document.getElementById('menuItems');
    menuItems.innerHTML = `
        <li><a href="${currentConfig.createPageLink}"> Add a ${userRole === 'student' ? 'Student' : 'Teacher'}</a></li>
        <li><a href="#" onclick="switchToRole('${targetRole}'); return false;">${currentConfig.switchToText}</a></li>

    `;
    const optionsSelect = document.getElementById('options');
    currentConfig.searchOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        optionsSelect.appendChild(optionElement);
    });

    const tableHead = document.getElementById('tableHead');
    let headerHTML = '<tr>';
    currentConfig.tableHolders.forEach(header => {
        headerHTML += `<th>${header}</th>`;
    });
    headerHTML += '</tr>';
    tableHead.innerHTML = headerHTML;
}

function displayData(data, input) {
    initializePage();
    const tableBody = document.getElementById('tableBody');
    const searchType = document.getElementById('options').value;  // Get selected option

    if (!data || data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6"> No students found.</td></tr>';
    }

    let searchTerm = input.value.toLowerCase().trim();
    let html = '';
    let foundCount = 0;

    data.forEach(item => {
        if (searchTerm) {
            let matches = false;

            if (searchType === 'Name') {
                matches = item.first_name.toLowerCase().includes(searchTerm) ||
                    item.last_name.toLowerCase().includes(searchTerm);
            } else if (searchType === 'Email') {
                matches = item.email.toLowerCase().includes(searchTerm);
            } else if (currentConfig.hasGrade && (searchType === 'Grade' || searchType === 'subject_Name')) {
                const gradeValue = item[currentConfig.gradeField];
                matches = gradeValue.toString().toLowerCase().includes(searchTerm);
            }

            if (!matches) {
                return;
            }
        }

        foundCount++;
        const gradeColumn = currentConfig.hasGrade ? `<td> ${item[currentConfig.gradeField] || ''} </td>` : '';

        html += `
            <tr>
                <td>${item.first_name} ${item.last_name}</td>
                <td>${item.email}</td>
                ${gradeColumn}
                <td><button type="button" onclick="updateItem(${item.id})" class="buttonUpdate">Update</button></td>
                <td><button type="button" onclick="deleteItem(${item.id})" class="buttonDelete">Delete</button></td>
            </tr>
        `;
    });

    if (!foundCount && searchTerm) {
        tableBody.innerHTML = `<tr><td colspan=0"${colspan}">No ${userRole}s found</td></tr>`;
    } else {
        tableBody.innerHTML = html;
    }
}

(async function () {
    initializePage();

    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;

    const token = localStorage.getItem('token');
    const messageDashboard = document.getElementById('messageDashboard');

    if (!token) {
        messageDashboard.textContent = "please login again";
        window.location.href = 'Login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080${currentConfig.apiEndpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            allData = data.data || data;
            const dummyInput = { value: '' };
            displayData(allData, dummyInput);
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
        displayData(allData, searchInput);
    });
}

if (searchType) {
    searchType.addEventListener('change', function () {
        displayData(allData, searchInput);
    });
}

window.updateItem = function (id) {
    localStorage.setItem(currentConfig.itemIdKey, id);
    window.location.href = currentConfig.updatePageLink;
}

window.deleteItem = function (id) {
    if (confirm(`Are you sure you want to delete this ${userRole}?`)) {
        deleteItemById(id);
    }
}

function deleteItemById(id) {
    (async function () {
        const token = localStorage.getItem('token');
        const messageDashboard = document.getElementById('messageDashboard');

        if (!token) {
            messageDashboard.textContent = "please login again";
            window.location.href = 'Login.html';
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080${currentConfig.apiEndpoint}/${id}`, {
                method: 'Delete',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                messageDashboard.style.color = 'green';
                messageDashboard.textContent = `the ${userRole} has been deleted `;
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


