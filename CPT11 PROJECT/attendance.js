document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addBtn");
  const studentNameInput = document.getElementById("studentName");
  const attendanceTable = document.querySelector("#attendanceTable tbody");

  //sa storage to wag muna galawin pinag aaralan kopa
  const params = new URLSearchParams(window.location.search);
  const section = params.get("section") || "default_section";

  let students = JSON.parse(localStorage.getItem(`students_${section}`)) || [];
  students.forEach((student) => {
    addStudentRow(student.name, student.image);
  });

  addBtn.addEventListener("click", () => {
    const name = studentNameInput.value.trim();

    if (name === "") {
      alert("Please enter a student name.");
      return;
    }

    const newStudent = { name, image: null };
    students.push(newStudent);
    saveStudents();

    addStudentRow(name, null);
    studentNameInput.value = "";
  });

  function addStudentRow(name, imageData) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = name;

    const pictureCell = document.createElement("td");
    const uploadBtn = document.createElement("button");
    uploadBtn.textContent = "Upload";
    uploadBtn.classList.add("upload-btn");

    const imagePreview = document.createElement("img");
    imagePreview.classList.add("upload-img");
    imagePreview.style.display = imageData ? "block" : "none";
    if (imageData) imagePreview.src = imageData;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    uploadBtn.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.src = e.target.result;
          imagePreview.style.display = "block";
          uploadBtn.style.display = "none";

          const index = students.findIndex((s) => s.name === name);
          if (index !== -1) {
            students[index].image = e.target.result;
            saveStudents();
          }
        };
        reader.readAsDataURL(file);
      }
    });

    pictureCell.appendChild(uploadBtn);
    pictureCell.appendChild(fileInput);
    pictureCell.appendChild(imagePreview);

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

    presentBtn.addEventListener("click", () => {
      nameCell.style.color = "green";
    });

    absentBtn.addEventListener("click", () => {
      nameCell.style.color = "red";
    });

    deleteBtn.addEventListener("click", () => {
      row.remove();
      students = students.filter((s) => s.name !== name);
      saveStudents();
    });

    statusCell.appendChild(presentBtn);
    statusCell.appendChild(absentBtn);
    statusCell.appendChild(deleteBtn);

    row.appendChild(nameCell);
    row.appendChild(pictureCell);
    row.appendChild(statusCell);

    attendanceTable.appendChild(row);
  }

  function saveStudents() {
    localStorage.setItem(`students_${section}`, JSON.stringify(students));
  }
});
