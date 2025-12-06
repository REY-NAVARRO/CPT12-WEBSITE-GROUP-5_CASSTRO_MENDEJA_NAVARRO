document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addBtn");
    const studentNameInput = document.getElementById("studentName");
    const attendanceTable = document.querySelector("#attendanceTable tbody");

    const userEmail = sessionStorage.getItem('userEmail');
    const userRole = sessionStorage.getItem('role');
    const userName = sessionStorage.getItem('userName');

    const urlParams = new URLSearchParams(window.location.search);
    const sectionName = urlParams.get('section');
    const owner = urlParams.get('owner');

    console.log('User Email:', userEmail);
    console.log('User Role:', userRole);
    console.log('User Name:', userName);
    console.log('Section Owner:', owner);

    const isOwnerTeacher = userRole === 'teacher' && userEmail === owner;

    if (isOwnerTeacher) {
        addBtn.textContent = "Add Student";
    } else if (userRole === 'student') {
        addBtn.textContent = "Add Myself";
        studentNameInput.value = userName;
    } else {
        addBtn.style.display = 'none';
        addBtn.disabled = true;
    }

    async function loadStudents() {
        try {
            const res = await fetch(`api/students.php?section=${encodeURIComponent(sectionName)}`, { credentials: 'include' });
            const students = await res.json();
            attendanceTable.innerHTML = '';
            students.forEach(student => addStudentRow(student));
        } catch (err) {
            console.error(err);
        }
    }

    loadStudents();

    addBtn.addEventListener("click", async () => {
        const name = studentNameInput.value.trim();
        if (!name) return alert("Enter your name.");

        try {
            const res = await fetch('api/students.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section: sectionName, name }),
                credentials: 'include'
            });
            const newStudent = await res.json();
            if (newStudent.error) return alert(newStudent.error);
            addStudentRow(newStudent);
            if (userRole === 'student') studentNameInput.value = userName;
            else studentNameInput.value = '';
        } catch (err) {
            console.error(err);
        }
    });

    function addStudentRow(student) {
        const { id, name, image, status, added_at } = student;

        const row = document.createElement("tr");

        const timeCell = document.createElement("td");
        const date = new Date(added_at);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(-2)}`;
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
        timeCell.textContent = `${formattedDate} ${hours}:${minutes} ${ampm}`;

        const nameCell = document.createElement("td");
        nameCell.textContent = name;

        const pictureCell = document.createElement("td");
        const uploadBtn = document.createElement("button");
        uploadBtn.textContent = "Upload";
        uploadBtn.classList.add("upload-btn");

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.style.display = "none";

        const imagePreview = document.createElement("img");
        imagePreview.classList.add("upload-img");
        imagePreview.style.cursor = "pointer";
        if (image) {
            imagePreview.src = image;
            imagePreview.style.display = "block";
            uploadBtn.style.display = "none";
        }
        imagePreview.addEventListener('click', () => {
            if (imagePreview.src) {
                document.getElementById('modalImage').src = imagePreview.src;
                document.getElementById('imageModal').style.display = 'block';
            }
        });

        uploadBtn.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", async () => {
            const file = fileInput.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('image', file);
            formData.append('student_id', id);

            try {
                const res = await fetch('api/upload.php', {
                    method: 'POST',
                    body: formData
                });
                const result = await res.json();
                if (result.error) return alert(result.error);

                imagePreview.src = result.url;
                imagePreview.style.display = "block";
                uploadBtn.style.display = "none";
                imagePreview.style.cursor = "pointer";
            } catch (err) {
                console.error(err);
            }
        });

        pictureCell.append(uploadBtn, fileInput, imagePreview);

        const statusCell = document.createElement("td");
        const presentBtn = document.createElement("button");
        presentBtn.textContent = "Present";
        presentBtn.classList.add("status-btn", "present");

        const absentBtn = document.createElement("button");
        absentBtn.textContent = "Absent";
        absentBtn.classList.add("status-btn", "absent");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✖";
        deleteBtn.classList.add("delete-btn");

        const statusCircle = document.createElement("div");
        statusCircle.classList.add("status-circle");
        if (status === "Present") statusCircle.style.background = "green";
        if (status === "Absent") statusCircle.style.background = "red";

        if (userRole === 'teacher') {
            presentBtn.addEventListener("click", () => updateStatus("Present"));
            absentBtn.addEventListener("click", () => updateStatus("Absent"));
            deleteBtn.addEventListener("click", async () => {
                if (!confirm(`Delete student "${name}"?`)) return;
                try {
                    const res = await fetch('api/students.php', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ student_id: id }),
                        credentials: 'include'
                    });
                    const result = await res.json();
                    if (result.success) row.remove();
                    else alert(result.error || 'Failed to delete student');
                } catch (err) {
                    console.error(err);
                }
            });
        } else {
            presentBtn.disabled = true;
            absentBtn.disabled = true;
            presentBtn.style.opacity = 0.5;
            absentBtn.style.opacity = 0.5;
            deleteBtn.style.display = "none";
        }

        async function updateStatus(newStatus) {
            try {
                const res = await fetch('api/students.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ student_id: id, status: newStatus }),
                    credentials: 'include'
                });
                const result = await res.json();
                if (result.success) statusCircle.style.background = newStatus === "Present" ? "green" : "red";
                else alert(result.error || 'Failed to update status');
            } catch (err) {
                console.error(err);
            }
        }

        statusCell.classList.add("status-cell");
        statusCell.append(presentBtn, absentBtn, statusCircle, deleteBtn);

        row.append(timeCell, nameCell, pictureCell, statusCell);
        attendanceTable.appendChild(row);
    }
});
