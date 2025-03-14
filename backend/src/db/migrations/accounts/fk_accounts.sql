ALTER TABLE accounts
    ADD CONSTRAINT fk_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;

ALTER TABLE accounts
    ADD CONSTRAINT fk_product_id
    FOREIGN KEY (product_id)
    REFERENCES account_products(id)
    ON DELETE CASCADE;

ALTER TABLE accounts
    ADD CONSTRAINT fk_branch_id
    FOREIGN KEY (branch_id)
    REFERENCES branches(id)
    ON DELETE CASCADE;