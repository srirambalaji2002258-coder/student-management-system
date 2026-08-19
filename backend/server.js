const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// Render gives us PORT automatically.
// 3000 is used when running locally.
const PORT = process.env.PORT || 3000;

// Student data file
const dataFile = path.join(__dirname, "student.json");

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());


// ========================================
// CREATE FILE AUTOMATICALLY
// ========================================

function ensureDataFile() {

    if (!fs.existsSync(dataFile)) {

        fs.writeFileSync(
            dataFile,
            "[]",
            "utf8"
        );

        console.log("student.json created");

    }

}


// ========================================
// READ STUDENTS
// ========================================

function readStudents() {

    console.log("Reading file:", dataFile);

    const data = fs.readFileSync(
        dataFile,
        "utf8"
    );

    console.log("File content:", data);

    // If the file is empty
    if (!data.trim()) {
        return [];
    }

    return JSON.parse(data);

}


// ========================================
// SAVE STUDENTS
// ========================================

function saveStudents(students) {

    fs.writeFileSync(
        dataFile,
        JSON.stringify(
            students,
            null,
            2
        ),
        "utf8"
    );

}


// ========================================
// HOME / TEST BACKEND
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

        res.json(students);

    } catch (error) {

        console.error(
            "GET ERROR:",
            error.message
        );

        res.status(500).json({

            message: "Unable to read student data",

            error: error.message

        });

    }

});


// ========================================
// ADD STUDENT
// ========================================

app.post("/students", (req, res) => {

    try {

        console.log("Received:", req.body);

        const students = readStudents();

        const newStudent = {

            studentId: Date.now(),

            name: req.body.name,

            age: req.body.age,

            course: req.body.course,

            email: req.body.email

        };

        students.push(newStudent);

        saveStudents(students);

        console.log(
            "Student saved successfully"
        );

        res.status(201).json({

            message: "Student added successfully",

            student: newStudent

        });

    } catch (error) {

        console.error(
            "POST ERROR:",
            error.message
        );

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

        const studentId =
            Number(req.params.id);

        const index =
            students.findIndex(
                student =>
                    student.studentId === studentId
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

        res.json({

            message: "Student updated successfully",

            student: students[index]

        });

    } catch (error) {

        console.error(
            "PUT ERROR:",
            error.message
        );

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

        const studentId =
            Number(req.params.id);

        const index =
            students.findIndex(
                student =>
                    student.studentId === studentId
            );

        if (index === -1) {

            return res.status(404).json({

                message: "Student not found"

            });

        }

        const deletedStudent =
            students.splice(index, 1)[0];

        saveStudents(students);

        res.json({

            message: "Student deleted successfully",

            student: deletedStudent

        });

    } catch (error) {

        console.error(
            "DELETE ERROR:",
            error.message
        );

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

// IMPORTANT FOR RENDER
// 0.0.0.0 allows Render to access the server.

app.listen(PORT, "0.0.0.0", () => {

    console.log("");

    console.log(
        "======================================"
    );

    console.log(
        " Student Management System Backend"
    );

    console.log(
        "======================================"
    );

    console.log(
        `Server is running on port ${PORT}`
    );

    console.log(
        `Data file: ${dataFile}`
    );

    console.log(
        "======================================"
    );

    console.log("");

});