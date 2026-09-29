const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "gaella1.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

// Check existing table
const tableExists = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table' AND name = 'students'
`).get();

if (!tableExists) {

    db.prepare(`
        CREATE TABLE students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            studentId TEXT,
            fullName TEXT NOT NULL,
            email TEXT NOT NULL,
            gender TEXT,
            course TEXT,
            phone TEXT
        )
    `).run();

} else {

    const columns = db.prepare("PRAGMA table_info(students)").all();
    const columnNames = columns.map(column => column.name);

    // Migrate old database that used "name"
    if (columnNames.includes("name")) {

        db.prepare(`
            CREATE TABLE students_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                studentId TEXT,
                fullName TEXT NOT NULL,
                email TEXT NOT NULL,
                gender TEXT,
                course TEXT,
                phone TEXT
            )
        `).run();

        db.prepare(`
            INSERT INTO students_new
            (id, studentId, fullName, email, gender, course, phone)
            SELECT
                id,
                ${columnNames.includes("studentId") ? "studentId" : "NULL"},
                name,
                email,
                ${columnNames.includes("gender") ? "gender" : "NULL"},
                ${columnNames.includes("course") ? "course" : "NULL"},
                ${columnNames.includes("phone") ? "phone" : "NULL"}
            FROM students
        `).run();

        db.prepare("DROP TABLE students").run();

        db.prepare(`
            ALTER TABLE students_new
            RENAME TO students
        `).run();

        console.log("Old database successfully migrated.");

    } else {

        // Add missing columns safely
        const currentColumns = db
            .prepare("PRAGMA table_info(students)")
            .all()
            .map(column => column.name);

        if (!currentColumns.includes("studentId")) {
            db.prepare(`
                ALTER TABLE students ADD COLUMN studentId TEXT
            `).run();
        }

        if (!currentColumns.includes("fullName")) {
            db.prepare(`
                ALTER TABLE students ADD COLUMN fullName TEXT
            `).run();
        }

        if (!currentColumns.includes("gender")) {
            db.prepare(`
                ALTER TABLE students ADD COLUMN gender TEXT
            `).run();
        }

        if (!currentColumns.includes("phone")) {
            db.prepare(`
                ALTER TABLE students ADD COLUMN phone TEXT
            `).run();
        }
    }
}

console.log("GAELLA1 database is ready.");

module.exports = db;