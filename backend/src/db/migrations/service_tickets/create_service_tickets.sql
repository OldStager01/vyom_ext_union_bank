CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS service_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id UUID NOT NULL,
    -- Assigned To
    assigned_to UUID,
    assigned_branch UUID,
    assigned_role_id INT,
    -- Ticket Details
    department VARCHAR(255) CHECK (department IN ('loan', 'operations')), 
    service_type VARCHAR(255),
    request_category VARCHAR(255),
    routing_destination VARCHAR(255) CHECK (routing_destination IN ('branch','central_office')) DEFAULT 'branch',
    ticket_priority VARCHAR(20) CHECK (ticket_priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    ticket_status VARCHAR(50) CHECK (ticket_status IN ('open', 'in_progress', 'resolved', 'escalated')) NOT NULL DEFAULT 'open',
    appointment_type VARCHAR(50) CHECK (appointment_type IN (null, 'chat', 'video', 'phone', 'email', 'sms')) DEFAULT null,
    escalation_level INT CHECK (escalation_level BETWEEN 1 AND 4) DEFAULT 1, -- Follows the tier escalation model
    resolved_by UUID REFERENCES employees(id), -- Who resolved the ticket
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

