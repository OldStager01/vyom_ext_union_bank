CREATE TABLE employee_roles (
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(role_id) ON DELETE CASCADE,
    PRIMARY KEY (employee_id, role_id)
);
