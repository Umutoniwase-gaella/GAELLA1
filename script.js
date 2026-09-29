const studentForm = document.getElementById("studentForm");
const message = document.getElementById("message");
const studentTableBody = document.getElementById("studentTableBody");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const API_URL = "/api/students";

let students = [];
let editId = null;


// Load students
async function loadStudents() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load students.");
        }

        students = await response.json();

        displayStudents(searchInput.value);

    } catch (error) {

        console.error(error);

        showMessage(
            "Could not connect to the backend.",
            "red"
        );
    }
}


// Add or update student
studentForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const student = {

        studentId:
            document.getElementById("studentId").value.trim(),

        fullName:
            document.getElementById("fullName").value.trim(),

        email:
            document.getElementById("email").value.trim(),

        gender:
            document.getElementById("gender").value,

        course:
            document.getElementById("course").value,

        phone:
            document.getElementById("phone").value.trim()
    };


    try {

        let response;

        if (editId === null) {

            response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(student)

            });

        } else {

            response = await fetch(
                `${API_URL}/${editId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(student)
                }
            );
        }


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.error || "Something went wrong."
            );
        }


        if (editId === null) {

            showMessage(
                "Student " +
                student.fullName +
                " registered successfully!",
                "green"
            );

        } else {

            showMessage(
                "Student " +
                student.fullName +
                " updated successfully!",
                "green"
            );
        }


        editId = null;

        studentForm.reset();

        await loadStudents();


    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            "red"
        );
    }

});


// Display students
function displayStudents(searchText = "") {

    studentTableBody.innerHTML = "";

    const search =
        searchText.toLowerCase().trim();


    students.forEach(function (student) {

        const studentData =
            (student.studentId || "") + " " +
            (student.fullName || "") + " " +
            (student.email || "") + " " +
            (student.gender || "") + " " +
            (student.course || "") + " " +
            (student.phone || "");


        if (
            !studentData
                .toLowerCase()
                .includes(search)
        ) {
            return;
        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${student.studentId || ""}</td>

            <td>${student.fullName || ""}</td>

            <td>${student.email || ""}</td>

            <td>${student.gender || ""}</td>

            <td>${student.course || ""}</td>

            <td>${student.phone || ""}</td>

            <td>

                <button
                    type="button"
                    onclick="editStudent(${student.id})"
                >
                    Edit
                </button>

                <button
                    type="button"
                    onclick="deleteStudent(${student.id})"
                >
                    Delete
                </button>

            </td>
        `;


        studentTableBody.appendChild(row);

    });
}


// Edit student
function editStudent(id) {

    const student =
        students.find(function (student) {

            return student.id === id;

        });


    if (!student) {
        return;
    }


    editId = id;


    document.getElementById("studentId").value =
        student.studentId || "";

    document.getElementById("fullName").value =
        student.fullName || "";

    document.getElementById("email").value =
        student.email || "";

    document.getElementById("gender").value =
        student.gender || "";

    document.getElementById("course").value =
        student.course || "";

    document.getElementById("phone").value =
        student.phone || "";


    showMessage(
        "Editing " +
        (student.fullName || "student"),
        "blue"
    );
}


// Delete student
async function deleteStudent(id) {

    const student =
        students.find(function (student) {

            return student.id === id;

        });


    if (!student) {
        return;
    }


    const confirmed = confirm(
        "Are you sure you want to delete " +
        (student.fullName || "this student") +
        "?"
    );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Failed to delete student."
            );
        }


        showMessage(
            "Student deleted successfully!",
            "green"
        );


        await loadStudents();


    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            "red"
        );
    }
}


// Search
searchButton.addEventListener(
    "click",
    function () {

        displayStudents(
            searchInput.value
        );

    }
);


// Search with Enter
searchInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            displayStudents(
                searchInput.value
            );
        }
    }
);


// Message
function showMessage(text, color) {

    message.textContent = text;

    message.style.color = color;
}


// Load when page opens
loadStudents();