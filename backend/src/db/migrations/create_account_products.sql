CREATE TABLE IF NOT EXISTS account_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name VARCHAR(50) UNIQUE NOT NULL CHECK (product_name IN ('DUSBG', 'DUSBP')),
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('savings', 'current', 'fixed_deposit')),
    min_balance DECIMAL(15,2) NOT NULL,
    min_funding DECIMAL(15,2) NOT NULL,
    debit_card_type VARCHAR(50) CHECK (debit_card_type IN ('Classic', 'Platinum')),
    free_transactions INT NOT NULL,
    daily_withdrawal_limit DECIMAL(15,2) NOT NULL,
    cheque_leaves INT NOT NULL,
    sms_banking_charges BOOLEAN NOT NULL DEFAULT TRUE,
    demand_draft_discount DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    closure_fee_applicable BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
