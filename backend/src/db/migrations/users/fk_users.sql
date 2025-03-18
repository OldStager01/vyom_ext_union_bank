ALTER TABLE users
    ADD CONSTRAINT fk_branch_id FOREIGN KEY (branch_id)
    REFERENCES branches(id) ON DELETE CASCADE;