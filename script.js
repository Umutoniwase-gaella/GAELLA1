const studentForm = document.getElementById("studentForm");
const message = document.getElementById("message");
const studentTableBody = document.getElementById("studentTableBody");
const searchInput = document.getElementById("searchInput");

let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = -1;

studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const student = {
        studentId: document.getElementById("studentId").value.trim(),
        fullName: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        gender: document.getElementById("gender").value,
        course: document.getElementById("course").value,
        phone: document.getElementById("phone").value.trim()
    };

    if (editIndex === -1) {
        students.push(student);
        message.textContent =
            "Student " + student.fullName + " registered successfully!";
    } else {
        students[editIndex] = student;
        message.textContent =
            "Student " + student.fullName + " updated successfully!";
        editIndex = -1;
    }

    localStorage.setItem("students", JSON.stringify(students));

    displayStudents(searchInput.value);

    message.style.color = "green";
    studentForm.reset();
});

function displayStudents(searchText = "") {
    studentTableBody.innerHTML = "";

    const search = searchText.toLowerCase().trim();

    students.forEach(function (student, index) {

        const studentData =
            student.studentId + " " +
            student.fullName + " " +
            student.email + " " +
            student.gender + " " +
            student.course + " " +
            student.phone;

        if (!studentData.toLowerCase().includes(search)) {
            return;
        }

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.studentId}</td>
            <td>${student.fullName}</td>
            <td>${student.email}</td>
            <td>${student.gender}</td>
            <td>${student.course}</td>
            <td>${student.phone}</td>
            <td>
                <button type="button" onclick="editStudent(${index})">
                    Edit
                </button>

                <button type="button" onclick="deleteStudent(${index})">
                    Delete
                </button>
            </td>
        `;

        studentTableBody.appendChild(row);
    });
}

function editStudent(index) {
    const student = students[index];

    editIndex = index;

    document.getElementById("studentId").value = student.studentId;
    document.getElementById("fullName").value = student.fullName;
    document.getElementById("email").value = student.email;
    document.getElementById("gender").value = student.gender;
    document.getElementById("course").value = student.course;
    document.getElementById("phone").value = student.phone;
}

function deleteStudent(index) {
    students.splice(index, 1);

    localStorage.setItem("students", JSON.stringify(students));

    displayStudents(searchInput.value);
}

searchInput.addEventListener("input", function () {
    displayStudents(this.value);
});

displayStudents(); 