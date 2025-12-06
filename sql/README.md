# 🧑‍🏫 Attendance Monitoring System

A simple, browser-based **Attendance Monitoring System** designed for professors to efficiently manage, track, and visualize student attendance records.  
Built using **HTML, CSS, and Vanilla JavaScript**, this project demonstrates an interactive front-end web application with local data storage via **LocalStorage**.

---

## 🚀 Features

### 🏠 Main Dashboard (`index.html`)
- Acts as the **homepage** and navigation hub.
- Provides quick access to:
  - Home, About, Services, Contact sections
  - “Create Attendance” module
  - “Feedback” form
- Responsive header that hides on scroll and reappears on mouse movement.
- Smooth scrolling and dynamic footer display.

### 🧾 Create Attendance (`create.html`)
- Professors can **create new sections and subjects**.
- Created sections are stored in **localStorage** and displayed as interactive cards.
- Each section card includes:
  - Section & subject name
  - “Open Attendance” button to redirect to its respective attendance sheet.
- Dynamic rendering of saved sections (persistent even after refreshing the page).

### 📋 Attendance Sheet (`attendance.html`)
- Allows instructors to **add student names** and manage attendance.
- Each student entry includes:
  - Upload button for student picture.
  - Status buttons for **Present / Absent** marking.
  - Delete option to remove entries.
- Supports **real-time data persistence** using `localStorage`.
- Student entries are linked to their respective section.

### 💬 Feedback Form (`feedback.html`)
- Interactive form where users can submit:
  - Name
  - Email
  - Contact number
  - Star rating (1–5)
  - Feedback message
- Styled with a modern dark theme and gold accent for readability.

---

## 🧠 Technologies Used

| Technology | Purpose |
|-------------|----------|
| **HTML5** | Structure of all pages |
| **CSS3** | Styling, layout, and responsiveness |
| **JavaScript (Vanilla)** | Page interactivity and local data handling |
| **LocalStorage API** | Persistent data storage without a backend |

---

## ⚙️ How to Use

1. **Open `index.html`** in your browser.  
   This is your entry point to the system.

2. Navigate to **“Create Attendance”** and add a new section and subject.

3. Click **“Open Attendance”** to view or manage students in that section.

4. Add student names, upload photos, and mark their attendance.

5. Go to **Feedback** via the footer button to share feedback about the system.

---

## 💾 Data Storage

All information (sections, student names, and images) is stored in your browser’s **LocalStorage**.  
This means:
- Data persists between sessions.
- No backend or server connection is required.

To reset data:
- Open **Developer Tools → Application → Local Storage**, then clear site data.

---

## Members

1. Rey Navarro
2. Allysa A. Castro
3. Angeline Mendeja