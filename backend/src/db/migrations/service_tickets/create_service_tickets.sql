CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS service_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id UUID NOT NULL,
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    branch_id UUID,
    -- Classification fields
    department VARCHAR(255) CHECK (department IN ('loan', 'operations')), 
    service_type VARCHAR(255),
    request_category VARCHAR(255),
    -- Forwarding field
    routing_destination VARCHAR(255) CHECK (routing_destination IN ('branch','central_office')) DEFAULT 'branch',
    assigned_to UUID,
    status VARCHAR(50) CHECK (status IN (
        'new',          -- Initial state when ticket is first created
        'open',         -- Ticket has been reviewed and accepted
        'in-progress',  -- Currently being worked on
        'pending',      -- Waiting on customer/external input
        'resolved',     -- Solution provided
        'closed',       -- Ticket completed and verified
        'cancelled'     -- Ticket cancelled/withdrawn
    )) DEFAULT 'new',
    sla_due_time TIMESTAMP,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

