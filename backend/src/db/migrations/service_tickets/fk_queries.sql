ALTER TABLE queries
ADD CONSTRAINT fk_queries_branches
FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL;

ALTER TABLE queries
ADD CONSTRAINT fk_queries_users
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;