CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_code VARCHAR(10) UNIQUE NOT NULL CHECK (branch_code ~ '^[A-Za-z0-9]{3,10}$'),
    branch_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pin_code TEXT NOT NULL CHECK (pin_code ~ '^[0-9]{4,10}$'),  -- Ensures valid PIN codes
    latitude DECIMAL(9,6) NOT NULL CHECK (latitude BETWEEN -90 AND 90),  
    longitude DECIMAL(9,6) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    location GEOGRAPHY(Point, 4326),
    phone VARCHAR(15) UNIQUE NOT NULL CHECK (phone ~ '^[0-9]{10,15}$'),
    manager_id UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


CREATE INDEX branches_location_idx ON branches USING GIST(location);
