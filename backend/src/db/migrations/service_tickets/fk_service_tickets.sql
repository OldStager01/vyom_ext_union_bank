ALTER TABLE service_tickets
ADD CONSTRAINT fk_service_tickets_queries
FOREIGN KEY (query_id) REFERENCES queries(id) ON DELETE CASCADE;

ALTER TABLE service_tickets
ADD CONSTRAINT fk_service_tickets_branches
FOREIGN KEY (assigned_branch) REFERENCES branches(id) ON DELETE SET NULL;

ALTER TABLE service_tickets
ADD CONSTRAINT fk_service_tickets_employees
FOREIGN KEY (assigned_to) REFERENCES employees(id) ON DELETE SET NULL;
ALTER TABLE service_tickets
ADD CONSTRAINT fk_service_tickets_roles
FOREIGN KEY (assigned_role_id) REFERENCES roles(role_id) ON DELETE SET NULL;
