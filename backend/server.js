const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// Railway provides the PORT automatically
const PORT = process.env.PORT || 3000;

// Student data file
const dataFile = path.join(__dirname, "student.json");

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());

// ========================================
// CREATE student.json IF IT DOES NOT EXIST
// ========================================

function ensureDataFile() {
    if (!fs.existsSync(dataFile)) {
        fs.writeFileSync(dataFile, "[]", "utf8");
        console.log("student.json created");
    }
}

// ========================================
// READ STUDENTS
// ========================================

function readStudents() {
    try {
        const data = fs.readFileSync(dataFile, "utf8");

        if (!data.trim()) {
            return [];
        }

        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading student.json:", error);
        return [];
    }
}

// ========================================
// SAVE STUDENTS
// ========================================

function saveStudents(students) {
    fs.writeFileSync(
        dataFile,
        JSON.stringify(students, null, 2),
        "utf8"
    );
}

// ========================================
// HOME
// ========================================

app.get("/", (req, res) => {
    res.json({
        message: "Student Management System Backend is Working!"
    });
});

// ========================================
// GET ALL STUDENTS
// ========================================

app.get("/students", (req, res) => {
    try {
        const students = readStudents();

        res.status(200).json(students);

    } catch (error) {
        console.error("GET ERROR:", error);

        res.status(500).json({
            message: "Unable to read student data"
        });
    }
});

// ========================================
// ADD STUDENT
// ========================================

app.post("/students", (req, res) => {
    try {
        const { name, age, course, email } = req.body;

        if (!name || !age || !course || !email) {
            return res.status(400).json({
                message: "All student details are required"
            });
        }

        const students = readStudents();

        const newStudent = {
            studentId: Date.now(),
            name: name,
            age: age,
            course: course,
            email: email
        };

        students.push(newStudent);

        saveStudents(students);

        console.log("Student added:", newStudent);

        res.status(201).json({
            message: "Student added successfully",
            student: newStudent
        });

    } catch (error) {
        console.error("POST ERROR:", error);

        res.status(500).json({
            message: "Unable to add student",
            error: error.message
        });
    }
});

// ========================================
// UPDATE STUDENT
// ========================================

app.put("/students/:id", (req, res) => {
    try {
        const students = readStudents();

        const studentId = Number(req.params.id);

        const index = students.findIndex(
            student => student.studentId === studentId
        );

        if (index === -1) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        students[index] = {
            ...students[index],
            name: req.body.name,
            age: req.body.age,
            course: req.body.course,
            email: req.body.email
        };

        saveStudents(students);

        res.status(200).json({
            message: "Student updated successfully",
            student: students[index]
        });

    } catch (error) {
        console.error("PUT ERROR:", error);

        res.status(500).json({
            message: "Unable to update student",
            error: error.message
        });
    }
});

// ========================================
// DELETE STUDENT
// ========================================

app.delete("/students/:id", (req, res) => {
    try {
        const students = readStudents();

        const studentId = Number(req.params.id);

        const index = students.findIndex(
            student => student.studentId === studentId
        );

        if (index === -1) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const deletedStudent = students.splice(index, 1)[0];

        saveStudents(students);

        res.status(200).json({
            message: "Student deleted successfully",
            student: deletedStudent
        });

    } catch (error) {
        console.error("DELETE ERROR:", error);

        res.status(500).json({
            message: "Unable to delete student",
            error: error.message
        });
    }
});

// ========================================
// START SERVER
// ========================================

ensureDataFile();

app.listen(PORT, "0.0.0.0", () => {
    console.log("======================================");
    console.log("Student Management System Backend");
    console.log("======================================");
    console.log(`Server running on port ${PORT}`);
    console.log(`Data file: ${dataFile}`);
    console.log("======================================");
});