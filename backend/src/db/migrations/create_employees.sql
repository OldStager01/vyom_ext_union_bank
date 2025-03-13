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
    role VARCHAR(50) NOT NULL CHECK (role IN ('manager', 'cashier', 'loan_officer', 'customer_support','kyc_agent')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'terminated')) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);