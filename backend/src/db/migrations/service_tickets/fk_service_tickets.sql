ALTER TABLE service_tickets
ADD CONSTRAINT fk_service_tickets_queries
FOREIGN KEY (query_id) REFERENCES queries(id) ON DELETE CASCADE;

ALTER TABLE service_tickets
ADD CONSTRAINT fk_service_tickets_branches
FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL;

ALTER TABLE service_tickets
ADD CONSTRAINT fk_service_tickets_employees
FOREIGN KEY (assigned_to) REFERENCES employees(id) ON DELETE SET NULL;
