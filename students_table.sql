CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_name VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    status ENUM('Present', 'Absent', 'Pending') DEFAULT 'Pending',
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_section (section_name)
);
