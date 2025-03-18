-- Create table for CIBIL user data
CREATE TABLE IF NOT EXISTS user_credit_bureau_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    income_tax_id VARCHAR(10) NOT NULL,
    cibil_score INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create table for credit accounts
CREATE TABLE IF NOT EXISTS user_credit_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_credit_bureau_id UUID,
    member_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create table for credit enquiries
CREATE TABLE IF NOT EXISTS user_credit_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_credit_bureau_id UUID,
    member_name VARCHAR(100) NOT NULL,
    enquiry_date DATE NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_credit_bureau_income_tax_id ON user_credit_bureau_data(income_tax_id);
CREATE INDEX IF NOT EXISTS idx_user_credit_accounts_user_id ON user_credit_accounts(user_credit_bureau_id);
CREATE INDEX IF NOT EXISTS idx_user_credit_enquiries_user_id ON user_credit_enquiries(user_credit_bureau_id);



-- Create view to combine all credit bureau data
CREATE OR REPLACE VIEW user_credit_bureau_complete AS
SELECT
    cbd.*,
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', ca.id,
                'member_name', ca.member_name,
                'account_number', ca.account_number,
                'type', ca.type,
                'created_at', ca.created_at,
                'updated_at', ca.updated_at
            )
        ) FILTER (WHERE ca.id IS NOT NULL), '[]'
    ) as credit_accounts,
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', ce.id,
                'member_name', ce.member_name,
                'enquiry_date', ce.enquiry_date,
                'purpose', ce.purpose,
                'created_at', ce.created_at,
                'updated_at', ce.updated_at
            )
        ) FILTER (WHERE ce.id IS NOT NULL), '[]'
    ) as credit_enquiries
FROM user_credit_bureau_data cbd
LEFT JOIN user_credit_accounts ca ON ca.user_credit_bureau_id = cbd.id
LEFT JOIN user_credit_enquiries ce ON ce.user_credit_bureau_id = cbd.id
GROUP BY cbd.id;

