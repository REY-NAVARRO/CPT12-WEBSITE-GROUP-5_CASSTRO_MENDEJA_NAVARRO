-- ============================================================================
-- ATTENDANCE MONITORING SYSTEM - SQL DATABASE DOCUMENTATION
-- ============================================================================
-- Project: Attendance Monitoring System
-- Members: Rey Navarro, Allysa A. Castro, Angeline Mendeja
-- Description: Complete SQL documentation for the attendance tracking system
-- ============================================================================

-- ============================================================================
-- 1. DATABASE CREATION
-- ============================================================================
-- Drop database if exists to start fresh
DROP DATABASE IF EXISTS attendance_system;

-- Create the main database
CREATE DATABASE attendance_system
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Use the created database
USE attendance_system;

-- ============================================================================
-- 2. TABLE CREATION WITH CONSTRAINTS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table: users
-- Purpose: Store student user accounts
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,                    -- Primary Key
    name VARCHAR(100) NOT NULL,                           -- Student full name
    email VARCHAR(100) NOT NULL UNIQUE,                   -- Unique email constraint
    password_hash VARCHAR(255) NOT NULL,                  -- Hashed password
    role VARCHAR(20) NOT NULL DEFAULT 'student',          -- Default role
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,       -- Auto timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_user_role CHECK (role IN ('student', 'admin')),
    CONSTRAINT chk_email_format CHECK (email LIKE '%@%'),
    
    -- Indexes for performance
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table: teachers
-- Purpose: Store teacher accounts with subject and section information
-- ----------------------------------------------------------------------------
CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,                    -- Primary Key
    name VARCHAR(100) NOT NULL,                           -- Teacher full name
    email VARCHAR(100) NOT NULL UNIQUE,                   -- Unique email
    password_hash VARCHAR(255) NOT NULL,                  -- Hashed password
    subject VARCHAR(100) NOT NULL,                        -- Subject taught
    section VARCHAR(50) NOT NULL,                         -- Section handled
    role VARCHAR(20) NOT NULL DEFAULT 'teacher',          -- Default role
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_teacher_role CHECK (role = 'teacher'),
    CONSTRAINT chk_teacher_email CHECK (email LIKE '%@%'),
    
    -- Indexes
    INDEX idx_teacher_email (email),
    INDEX idx_subject (subject)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table: sections
-- Purpose: Store class sections created by teachers
-- ----------------------------------------------------------------------------
CREATE TABLE sections (
    id INT AUTO_INCREMENT PRIMARY KEY,                    -- Primary Key
    section_name VARCHAR(100) NOT NULL,                   -- Section name
    subject VARCHAR(100) NOT NULL,                        -- Subject name
    owner_email VARCHAR(100) NOT NULL,                    -- Teacher's email (FK reference)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_section_name CHECK (LENGTH(section_name) >= 2),
    
    -- Foreign Key
    CONSTRAINT fk_section_owner 
        FOREIGN KEY (owner_email) 
        REFERENCES teachers(email) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_owner (owner_email),
    INDEX idx_section_name (section_name)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table: students
-- Purpose: Store student attendance records for each section
-- ----------------------------------------------------------------------------
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,                    -- Primary Key
    section VARCHAR(100) NOT NULL,                        -- Section name (FK reference)
    name VARCHAR(100) NOT NULL,                           -- Student name
    image TEXT,                                           -- Student photo URL
    status VARCHAR(20) DEFAULT 'Absent',                  -- Default status
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_status CHECK (status IN ('Present', 'Absent')),
    CONSTRAINT chk_student_name CHECK (LENGTH(name) >= 2),
    
    -- Indexes
    INDEX idx_section (section),
    INDEX idx_status (status),
    INDEX idx_added_at (added_at)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table: feedback
-- Purpose: Store user feedback and ratings
-- ----------------------------------------------------------------------------
CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,                    -- Primary Key
    name VARCHAR(100) NOT NULL,                           -- User name
    email VARCHAR(100) NOT NULL,                          -- User email
    phone VARCHAR(20) NOT NULL,                           -- Contact number
    rating INT NOT NULL,                                  -- Rating 1-5
    message TEXT NOT NULL,                                -- Feedback message
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT chk_feedback_email CHECK (email LIKE '%@%'),
    CONSTRAINT chk_phone CHECK (LENGTH(phone) >= 10),
    
    -- Indexes
    INDEX idx_rating (rating),
    INDEX idx_submitted_at (submitted_at)
) ENGINE=InnoDB;

-- ============================================================================
-- 3. INSERT SAMPLE RECORDS (Minimum 5 records per table)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Insert sample users (students)
-- ----------------------------------------------------------------------------
INSERT INTO users (name, email, password_hash, role) VALUES
    ('Juan Dela Cruz', 'juan.delacruz@student.edu', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', 'student'),
    ('Maria Santos', 'maria.santos@student.edu', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', 'student'),
    ('Pedro Reyes', 'pedro.reyes@student.edu', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', 'student'),
    ('Ana Garcia', 'ana.garcia@student.edu', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', 'student'),
    ('Carlos Mendoza', 'carlos.mendoza@student.edu', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', 'student'),
    ('Sofia Ramos', 'sofia.ramos@student.edu', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', 'student');

-- ----------------------------------------------------------------------------
-- Insert sample teachers
-- ----------------------------------------------------------------------------
INSERT INTO teachers (name, email, password_hash, subject, section, role) VALUES
    ('Prof. Rey Navarro', 'rey.navarro@teacher.edu', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', 'Computer Programming', 'CPT-11A', 'teacher'),
    ('Prof. Allysa Castro', 'allysa.castro@teacher.edu', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', 'Web Development', 'CPT-12B', 'teacher'),
    ('Prof. Angeline Mendeja', 'angeline.mendeja@teacher.edu', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', 'Database Management', 'CPT-13C', 'teacher'),
    ('Prof. John Smith', 'john.smith@teacher.edu', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', 'Data Structures', 'CPT-14D', 'teacher'),
    ('Prof. Jane Doe', 'jane.doe@teacher.edu', '$2y$10$abcdefghijklmnopqrstuvwxyz123456', 'Software Engineering', 'CPT-15E', 'teacher');

-- ----------------------------------------------------------------------------
-- Insert sample sections
-- ----------------------------------------------------------------------------
INSERT INTO sections (section_name, subject, owner_email) VALUES
    ('CPT-11A', 'Computer Programming', 'rey.navarro@teacher.edu'),
    ('CPT-12B', 'Web Development', 'allysa.castro@teacher.edu'),
    ('CPT-13C', 'Database Management', 'angeline.mendeja@teacher.edu'),
    ('CPT-14D', 'Data Structures', 'john.smith@teacher.edu'),
    ('CPT-15E', 'Software Engineering', 'jane.doe@teacher.edu'),
    ('CPT-11B', 'Computer Programming', 'rey.navarro@teacher.edu');

-- ----------------------------------------------------------------------------
-- Insert sample students (attendance records)
-- ----------------------------------------------------------------------------
INSERT INTO students (section, name, image, status, added_at) VALUES
    ('CPT-11A', 'Juan Dela Cruz', 'uploads/juan.jpg', 'Present', '2025-01-15 08:30:00'),
    ('CPT-11A', 'Maria Santos', 'uploads/maria.jpg', 'Present', '2025-01-15 08:32:00'),
    ('CPT-11A', 'Pedro Reyes', NULL, 'Absent', '2025-01-15 08:35:00'),
    ('CPT-12B', 'Ana Garcia', 'uploads/ana.jpg', 'Present', '2025-01-15 09:00:00'),
    ('CPT-12B', 'Carlos Mendoza', 'uploads/carlos.jpg', 'Present', '2025-01-15 09:05:00'),
    ('CPT-13C', 'Sofia Ramos', NULL, 'Absent', '2025-01-15 10:00:00'),
    ('CPT-14D', 'Juan Dela Cruz', 'uploads/juan2.jpg', 'Present', '2025-01-15 11:00:00');

-- ----------------------------------------------------------------------------
-- Insert sample feedback
-- ----------------------------------------------------------------------------
INSERT INTO feedback (name, email, phone, rating, message) VALUES
    ('Juan Dela Cruz', 'juan.delacruz@student.edu', '09171234567', 5, 'Excellent attendance system! Very easy to use.'),
    ('Maria Santos', 'maria.santos@student.edu', '09181234567', 4, 'Great system, but could use more features.'),
    ('Pedro Reyes', 'pedro.reyes@student.edu', '09191234567', 5, 'Love the interface! Very user-friendly.'),
    ('Ana Garcia', 'ana.garcia@student.edu', '09201234567', 3, 'Good system, needs improvement on mobile view.'),
    ('Carlos Mendoza', 'carlos.mendoza@student.edu', '09211234567', 4, 'Works well for tracking attendance.'),
    ('Sofia Ramos', 'sofia.ramos@student.edu', '09221234567', 5, 'Perfect for our class needs!');

-- ============================================================================
-- 4. UPDATE QUERIES
-- ============================================================================

-- Update student status from Absent to Present
UPDATE students 
SET status = 'Present', 
    updated_at = CURRENT_TIMESTAMP
WHERE name = 'Pedro Reyes' AND section = 'CPT-11A';

-- Update teacher's subject
UPDATE teachers 
SET subject = 'Advanced Web Development',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'allysa.castro@teacher.edu';

-- Update section name
UPDATE sections 
SET section_name = 'CPT-11A-UPDATED'
WHERE id = 1;

-- Update user role to admin
UPDATE users 
SET role = 'admin'
WHERE email = 'juan.delacruz@student.edu';

-- Update multiple students' status in a section
UPDATE students 
SET status = 'Present'
WHERE section = 'CPT-12B' AND status = 'Absent';

-- ============================================================================
-- 5. DELETE QUERIES
-- ============================================================================

-- Delete a specific student record
DELETE FROM students 
WHERE id = 7;

-- Delete feedback older than 6 months
DELETE FROM feedback 
WHERE submitted_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);

-- Delete sections with no students (using subquery)
DELETE FROM sections 
WHERE section_name NOT IN (SELECT DISTINCT section FROM students);

-- Delete inactive users (example: no login for 1 year)
DELETE FROM users 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR) 
  AND role = 'student';

-- ============================================================================
-- 6. SELECT QUERIES WITH VARIOUS CLAUSES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- WHERE Clause Examples
-- ----------------------------------------------------------------------------

-- Select all present students
SELECT * FROM students 
WHERE status = 'Present';

-- Select teachers teaching Computer Programming
SELECT * FROM teachers 
WHERE subject = 'Computer Programming';

-- Select feedback with rating 5
SELECT * FROM feedback 
WHERE rating = 5;

-- ----------------------------------------------------------------------------
-- AND, OR Operators
-- ----------------------------------------------------------------------------

-- Select present students in CPT-11A section
SELECT name, section, status, added_at 
FROM students 
WHERE section = 'CPT-11A' AND status = 'Present';

-- Select students who are either in CPT-11A or CPT-12B
SELECT name, section, status 
FROM students 
WHERE section = 'CPT-11A' OR section = 'CPT-12B';

-- Select feedback with rating 4 or 5 from specific email domain
SELECT name, email, rating, message 
FROM feedback 
WHERE (rating = 4 OR rating = 5) AND email LIKE '%@student.edu';

-- ----------------------------------------------------------------------------
-- LIKE Operator
-- ----------------------------------------------------------------------------

-- Find students whose name starts with 'Juan'
SELECT * FROM students 
WHERE name LIKE 'Juan%';

-- Find teachers with 'Programming' in their subject
SELECT name, subject, section 
FROM teachers 
WHERE subject LIKE '%Programming%';

-- Find users with gmail accounts
SELECT name, email, role 
FROM users 
WHERE email LIKE '%@gmail.com';

-- Find sections starting with 'CPT-1'
SELECT * FROM sections 
WHERE section_name LIKE 'CPT-1%';

-- ----------------------------------------------------------------------------
-- ORDER BY Clause
-- ----------------------------------------------------------------------------

-- List students ordered by name (ascending)
SELECT name, section, status 
FROM students 
ORDER BY name ASC;

-- List feedback by rating (descending) and date
SELECT name, rating, message, submitted_at 
FROM feedback 
ORDER BY rating DESC, submitted_at DESC;

-- List teachers alphabetically by name
SELECT name, subject, section 
FROM teachers 
ORDER BY name ASC;

-- List sections by creation date (newest first)
SELECT section_name, subject, created_at 
FROM sections 
ORDER BY created_at DESC;

-- ----------------------------------------------------------------------------
-- CONCAT and Computed Fields
-- ----------------------------------------------------------------------------

-- Concatenate teacher name with subject
SELECT 
    CONCAT(name, ' - ', subject) AS teacher_info,
    section,
    email
FROM teachers;

-- Create full student info with status
SELECT 
    CONCAT(name, ' (', section, ')') AS student_section,
    status,
    CONCAT('Status: ', status) AS status_label
FROM students;

-- Calculate days since feedback was submitted
SELECT 
    name,
    rating,
    message,
    DATEDIFF(NOW(), submitted_at) AS days_ago
FROM feedback;

-- Concatenate user info with role badge
SELECT 
    CONCAT(name, ' [', UPPER(role), ']') AS user_info,
    email,
    created_at
FROM users;

-- ----------------------------------------------------------------------------
-- Aliases (AS keyword)
-- ----------------------------------------------------------------------------

-- Use aliases for cleaner output
SELECT 
    s.name AS student_name,
    s.section AS class_section,
    s.status AS attendance_status,
    DATE_FORMAT(s.added_at, '%M %d, %Y %h:%i %p') AS time_added
FROM students AS s
WHERE s.status = 'Present';

-- Aliases with computed fields
SELECT 
    t.name AS professor,
    t.subject AS course,
    t.section AS class_code,
    COUNT(*) AS total_sections
FROM teachers AS t
GROUP BY t.name, t.subject, t.section;

-- ----------------------------------------------------------------------------
-- INNER JOIN Queries (Minimum 2)
-- ----------------------------------------------------------------------------

-- JOIN Query 1: Get sections with teacher information
SELECT 
    s.section_name AS section,
    s.subject AS subject_name,
    t.name AS teacher_name,
    t.email AS teacher_email,
    s.created_at AS section_created
FROM sections AS s
INNER JOIN teachers AS t ON s.owner_email = t.email
ORDER BY s.section_name;

-- JOIN Query 2: Get student attendance with section details
SELECT 
    st.name AS student_name,
    st.status AS attendance_status,
    st.section AS section_code,
    sec.subject AS subject_name,
    t.name AS instructor,
    DATE_FORMAT(st.added_at, '%m/%d/%y %h:%i %p') AS time_recorded
FROM students AS st
INNER JOIN sections AS sec ON st.section = sec.section_name
INNER JOIN teachers AS t ON sec.owner_email = t.email
WHERE st.status = 'Present'
ORDER BY st.added_at DESC;

-- JOIN Query 3: Count students per section with teacher info
SELECT 
    sec.section_name AS section,
    sec.subject AS subject,
    t.name AS teacher,
    COUNT(st.id) AS total_students,
    SUM(CASE WHEN st.status = 'Present' THEN 1 ELSE 0 END) AS present_count,
    SUM(CASE WHEN st.status = 'Absent' THEN 1 ELSE 0 END) AS absent_count
FROM sections AS sec
INNER JOIN teachers AS t ON sec.owner_email = t.email
LEFT JOIN students AS st ON sec.section_name = st.section
GROUP BY sec.section_name, sec.subject, t.name
ORDER BY total_students DESC;

-- JOIN Query 4: Get complete attendance report
SELECT 
    t.name AS teacher_name,
    sec.section_name AS section,
    sec.subject AS subject,
    st.name AS student_name,
    st.status AS status,
    CONCAT(
        DATE_FORMAT(st.added_at, '%m/%d/%y'),
        ' ',
        DATE_FORMAT(st.added_at, '%h:%i %p')
    ) AS attendance_time
FROM teachers AS t
INNER JOIN sections AS sec ON t.email = sec.owner_email
INNER JOIN students AS st ON sec.section_name = st.section
WHERE st.added_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY t.name, sec.section_name, st.added_at;

-- ============================================================================
-- 7. ADVANCED QUERIES (Bonus)
-- ============================================================================

-- Get attendance statistics by section
SELECT 
    section AS class_section,
    COUNT(*) AS total_records,
    SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) AS present,
    SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) AS absent,
    ROUND(
        (SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) * 100.0) / COUNT(*), 
        2
    ) AS attendance_percentage
FROM students
GROUP BY section
ORDER BY attendance_percentage DESC;

-- Get average rating per month
SELECT 
    DATE_FORMAT(submitted_at, '%Y-%m') AS month,
    COUNT(*) AS total_feedback,
    AVG(rating) AS average_rating,
    MIN(rating) AS lowest_rating,
    MAX(rating) AS highest_rating
FROM feedback
GROUP BY DATE_FORMAT(submitted_at, '%Y-%m')
ORDER BY month DESC;

-- Find teachers with most sections
SELECT 
    t.name AS teacher_name,
    t.email AS email,
    COUNT(s.id) AS total_sections,
    GROUP_CONCAT(s.section_name SEPARATOR ', ') AS sections_list
FROM teachers AS t
LEFT JOIN sections AS s ON t.email = s.owner_email
GROUP BY t.name, t.email
ORDER BY total_sections DESC;

-- ============================================================================
-- END OF SQL DOCUMENTATION
-- ============================================================================
