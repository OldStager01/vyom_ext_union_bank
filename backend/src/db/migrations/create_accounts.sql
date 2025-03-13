CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CREATE TABLE IF NOT EXISTS accounts (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     user_id UUID NOT NULL,
--     account_number VARCHAR(20) UNIQUE NOT NULL,  
--     balance DECIMAL(15,2) NOT NULL DEFAULT 0.00, 
--     status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'closed', 'frozen')),
--     created_at TIMESTAMP DEFAULT NOW(),
--     updated_at TIMESTAMP DEFAULT NOW()
-- );


CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    product_id UUID NOT NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'closed', 'frozen')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
