CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_number VARCHAR(12) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    aadhaar_number VARCHAR(12) UNIQUE NOT NULL, 
    pan_number VARCHAR(10) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    address TEXT,
    facial_embedding FLOAT[],
    facial_embedding_updated_at TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'terminated')),
    credit_score INT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
