CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_number VARCHAR(12) UNIQUE NOT NULL,
    branch_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    spoken_languages VARCHAR(100)[] NOT NULL,
    refresh_token VARCHAR(255) DEFAULT NULL,
    roles VARCHAR(50)[] NOT NULL CHECK (
        CASE department
            WHEN 'operations' THEN roles <@ ARRAY[
                'central',
                'account_services',
                'address_changes',
                'contact_details',
                'identity_updates',
                'certificates',
                'name_changes',
                'cash_services',
                'card_services',
                'security',
                'general',
                'cheque_services'
            ]::VARCHAR(50)[]
            WHEN 'loans' THEN roles <@ ARRAY[
                'central',
                'loans_general',
                'home_loan',
                'vehicle_loan',
                'educational_loan',
                'personal_loan',
                'loan_against_property',
                'senior_citizen_loans',
                'gold_loan',
                'interest_rates'
            ]::VARCHAR(50)[]
            ELSE false
        END
    ),
    department VARCHAR(50) NOT NULL CHECK (department IN ('operations', 'loans')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'terminated')) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


-- feedback{
--     id,
--     employee_id,
--     branch_id,
--     behaviour,
--     communication,
--     satisfaction,
--     overall_rating,
--     comment: "Good Service $$ Excellent $$ Bad Tone $$ "
-- }

-- -- 1 Employee : 50 Services: Data Agrregated in Numbers

