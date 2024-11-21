-- Create User table
CREATE TABLE "user"(
  "id" serial PRIMARY KEY,
  "email" varchar(255) NOT NULL UNIQUE,
  "password" varchar(255) NOT NULL,
  "full_name" varchar(255) NOT NULL,
  "role" varchar(10) NOT NULL CHECK (ROLE IN ('STUDENT', 'LECTURER')) -- Only allow STUDENT or LECTURER
);

-- Create CourseClass table
CREATE TABLE "course_class"(
  "id" serial PRIMARY KEY,
  "class_name" varchar(255) NOT NULL,
  "course_name" varchar(255) NOT NULL,
  "number_of_student" integer NOT NULL,
  "status" varchar(10) NOT NULL CHECK (status IN ('OPEN', 'CLOSE')), -- Only allow OPEN or CLOSE
  "class_monitor_id" integer REFERENCES "user"("id") ON DELETE SET NULL,
  "lecturer_id" integer REFERENCES "user"("id") ON DELETE SET NULL
);

-- Create junction table for ManyToMany relationship
CREATE TABLE "course_class_students"(
  "course_class_id" integer REFERENCES "course_class"("id") ON DELETE CASCADE,
  "user_id" integer REFERENCES "user"("id") ON DELETE CASCADE,
  PRIMARY KEY ("course_class_id", "user_id")
);

-- Seed data for User table
INSERT INTO "user"(email, PASSWORD, full_name, ROLE)
  VALUES ('lecturer@gmail.com', '
$2b$10$9AG6JVfngU9JKmkgKI56T.I5xDlM0t8H7qb3IKxsawsya9xlxUuTi', 'Lecturer One', 'LECTURER'),
('monitor@gmail.com', '
$2b$10$9AG6JVfngU9JKmkgKI56T.I5xDlM0t8H7qb3IKxsawsya9xlxUuTi', 'Monitor One', 'STUDENT'),
('student1@gmail.com', '
$2b$10$9AG6JVfngU9JKmkgKI56T.I5xDlM0t8H7qb3IKxsawsya9xlxUuTi', 'Student One', 'STUDENT'),
('student2@gmail.com', '
$2b$10$9AG6JVfngU9JKmkgKI56T.I5xDlM0t8H7qb3IKxsawsya9xlxUuTi', 'Student Two', 'STUDENT');

-- Seed data for CourseClass table
INSERT INTO "course_class"(class_name, course_name, number_of_student, status, class_monitor_id, lecturer_id)
  VALUES ('Class A', 'Course 101', 30, 'OPEN', 2, 1),
('Class B', 'Course 102', 25, 'OPEN', 2, 1),
('Class C', 'Course 103', 20, 'CLOSE', 2, 1);

-- Seed data for course_class_students table (ManyToMany relationship)
INSERT INTO "course_class_students"(course_class_id, user_id)
  VALUES (1, 3), -- Student One in Class A
(1, 4), -- Student Two in Class A
(2, 3), -- Student One in Class B
(2, 4);

-- Student Two in Class B
