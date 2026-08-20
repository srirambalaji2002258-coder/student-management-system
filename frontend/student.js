const API_URL = "https://student-management-system-production-b882.up.railway.app";
// ================================
// LOAD STUDENTS
// ================================

async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/students`);

        if (!response.ok) {
            throw new Error("Backend request failed");
        }

        const students = await response.json();

        displayStudents(students);

    } catch (error) {
        console.error("Backend Error:", error);

        document.getElementById("studentList").innerHTML =
            "<p>Unable to connect to backend.</p>";
    }
}


// ================================
// DISPLAY STUDENTS
// ================================

function displayStudents(students) {

    const studentList = document.getElementById("studentList");

    studentList.innerHTML = "";

    if (students.length === 0) {
        studentList.innerHTML = "<p>No students found.</p>";
        return;
    }

    students.forEach(student => {

        studentList.innerHTML += `
            <div class="student-card">

                <h3>🎓 ${student.name}</h3>

                <p><strong>ID:</strong> ${student.studentId}</p>

                <p><strong>Age:</strong> ${student.age}</p>

                <p><strong>Course:</strong> ${student.course}</p>

                <p><strong>Email:</strong> ${student.email}</p>

                <div class="student-actions">

                    <button
                        class="edit-button"
                        onclick="editStudent(${student.studentId})">
                        ✏️ Edit
                    </button>

                    <button
                        class="delete-button"
                        onclick="deleteStudent(${student.studentId})">
                        🗑️ Delete
                    </button>

                </div>

            </div>
        `;
    });
}


// ================================
// ADD STUDENT
// ================================

document
    .getElementById("studentForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const student = {

            name: document.getElementById("name").value,

            age: document.getElementById("age").value,

            course: document.getElementById("course").value,

            email: document.getElementById("email").value

        };

        try {

            const response = await fetch(
                `${API_URL}/students`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(student)
                }
            );

            const result = await response.json();

            document.getElementById("message").innerText =
                result.message;

            document.getElementById("studentForm").reset();

            loadStudents();

        } catch (error) {

            console.error(error);

            document.getElementById("message").innerText =
                "Unable to connect to backend.";

        }

    });


// ================================
// DELETE STUDENT
// ================================

async function deleteStudent(id) {

    if (!confirm("Delete this student?")) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/students/${id}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        alert(result.message);

        loadStudents();

    } catch (error) {

        console.error(error);

        alert("Unable to delete student.");

    }
}


// ================================
// EDIT STUDENT
// ================================

async function editStudent(id) {

    const name = prompt("Enter new student name:");

    if (name === null) {
        return;
    }

    const age = prompt("Enter new age:");

    if (age === null) {
        return;
    }

    const course = prompt("Enter new course:");

    if (course === null) {
        return;
    }

    const email = prompt("Enter new email:");

    if (email === null) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/students/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    age: age,
                    course: course,
                    email: email
                })
            }
        );

        const result = await response.json();

        alert(result.message);

        loadStudents();

    } catch (error) {

        console.error(error);

        alert("Unable to update student.");

    }
}


// ================================
// SEARCH
// ================================

document
    .getElementById("searchInput")
    .addEventListener("input", async function() {

        const searchText =
            this.value.toLowerCase();

        try {

            const response =
                await fetch(`${API_URL}/students`);

            const students =
                await response.json();

            const filteredStudents =
                students.filter(student =>
                    student.name
                        .toLowerCase()
                        .includes(searchText)
                );

            displayStudents(filteredStudents);

        } catch (error) {

            console.error(error);

        }

    });


// ================================
// REFRESH
// ================================

document
    .getElementById("refreshButton")
    .addEventListener("click", function() {

        loadStudents();

    });


// ================================
// START
// ================================

loadStudents();