const express = require("express");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));


// GET all students
app.get("/api/students", (req, res) => {

    const students = db.prepare(`
        SELECT *
        FROM students
        ORDER BY id DESC
    `).all();

    res.json(students);
});


// POST - Add student
app.post("/api/students", (req, res) => {

    const {
        studentId,
        fullName,
        email,
        gender,
        course,
        phone
    } = req.body;

    if (!studentId || !fullName || !email || !gender || !course || !phone) {

        return res.status(400).json({
            error: "All student information is required."
        });
    }

    const result = db.prepare(`
        INSERT INTO students
        (studentId, fullName, email, gender, course, phone)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(
        studentId,
        fullName,
        email,
        gender,
        course,
        phone
    );

    const student = db.prepare(`
        SELECT *
        FROM students
        WHERE id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(student);
});


// PUT - Update student
app.put("/api/students/:id", (req, res) => {

    const {
        studentId,
        fullName,
        email,
        gender,
        course,
        phone
    } = req.body;

    const result = db.prepare(`
        UPDATE students
        SET
            studentId = ?,
            fullName = ?,
            email = ?,
            gender = ?,
            course = ?,
            phone = ?
        WHERE id = ?
    `).run(
        studentId,
        fullName,
        email,
        gender,
        course,
        phone,
        req.params.id
    );

    if (result.changes === 0) {

        return res.status(404).json({
            error: "Student not found."
        });
    }

    const student = db.prepare(`
        SELECT *
        FROM students
        WHERE id = ?
    `).get(req.params.id);

    res.json(student);
});


// DELETE - Delete student
app.delete("/api/students/:id", (req, res) => {

    const result = db.prepare(`
        DELETE FROM students
        WHERE id = ?
    `).run(req.params.id);

    if (result.changes === 0) {

        return res.status(404).json({
            error: "Student not found."
        });
    }

    res.json({
        message: "Student deleted successfully."
    });
});


app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});