-- Add foreign key constraints for credit bureau related tables
ALTER TABLE user_credit_bureau_data
    ADD CONSTRAINT fk_user_credit_bureau_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;

ALTER TABLE user_credit_accounts
    ADD CONSTRAINT fk_user_credit_bureau_accounts
    FOREIGN KEY (user_credit_bureau_id)
    REFERENCES user_credit_bureau_data(id)
    ON DELETE CASCADE;

ALTER TABLE user_credit_enquiries
    ADD CONSTRAINT fk_user_credit_bureau_enquiries
    FOREIGN KEY (user_credit_bureau_id)
    REFERENCES user_credit_bureau_data(id)
    ON DELETE CASCADE; 