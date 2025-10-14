# 📘 Professor Dashboard - Attendance Monitoring System

This project is a **simple web-based Attendance Monitoring System** designed for professors to manage attendance creation, section tracking, and collect user feedback.  
It includes three main HTML pages:  
- `index.html` – Dashboard homepage  
- `create.html` – Attendance creation page  
- `feedback.html` – Feedback form page  

---

## 🏠 index.html — Main Dashboard

### 🔹 Purpose
The homepage serves as the **central hub** for navigation and general information about the Attendance Monitoring System.

### 🧩 Structure
- **Header:**  
  Contains the school logo and navigation bar with links to each section (`Home`, `Create Attendance`, `About`, `Services`, `Contact`).
  
- **Sections:**
  - **Home:** Welcoming message.
  - **Create Attendance:** Button linking to `create.html` for creating new attendance records.
  - **About:** Description of the system’s purpose and benefits.
  - **Services:** Overview of features offered.
  - **Contact:** Contact details for support and communication.

- **Footer:**  
  Includes a copyright  
  and a **Feedback button** linking to `feedback.html`.

### 💻 Technologies Used
- HTML5  
- CSS (linked via `style.css`)  
- JavaScript (`script.js` for any future interactive features)

---

## 🧾 create.html — Attendance Creation Page

### 🔹 Purpose
Allows professors to **create attendance records** for different sections and subjects dynamically.

### 🧩 Structure
- **Header:**  
  Similar navigation bar as the main page for consistency.

- **Create Attendance Form:**
  - Inputs:  
    - `Section` (text input)  
    - `Subject` (text input)
  - Button:  
    - `➕ Create` to generate a new attendance card.

- **Generated Sections Display:**
  - A grid (`#section-grid`) dynamically displays created sections and subjects.
  - Each card includes:
    - Section name  
    - Subject name  
    - `Open Attendance` button → Redirects to `attendance.html` with query parameters.

- **Footer:**  
  Simple footer with project credit.
