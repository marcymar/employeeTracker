USE employee_db;

INSERT INTO department (name)
VALUES ('Programming'), ('Art'), ('Design');

INSERT INTO role (title, salary, department_id)
VALUES ('Head Programmer', 95000, 1),
('Tester', 46000, 1),
('Character Concept Artist', 50000, 2),
('SR Concept Artist', 120000, 2),
('Level Designer', 35000, 3),
('Designer III', 100000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Chris', 'Carbonell', 1, NULL),
('Jordan', 'Meyer', 2, 1),
('Gabrielle', 'Machado', 4, NULL),
('Shadow', 'Stewart', 3, 3),
('Danny', 'Torres', 6, NULL),
('Nathan', 'Anson', 5, 5);