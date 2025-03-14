CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS service_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(12) UNIQUE NOT NULL,
    user_id UUID NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('loan', 'transaction', 'account_issue', 'general')), 
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('open', 'in_progress', 'closed')),
    assigned_to UUID,
    priority VARCHAR(20) NOT NULL DEFAULT 'low' CHECK (priority IN ('low', 'medium', 'high')),
    video_query_id UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

