CREATE TABLE queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    branch_id UUID, -- Handles branch-specific tickets
    query_type VARCHAR(50) CHECK (query_type IN ('text', 'predefined', 'video')) NOT NULL,
    query_text TEXT,  -- Stores textual queries
    predefined_query VARCHAR(255),  -- If it's a predefined question
    video_url TEXT,
    transcript TEXT, 
    category VARCHAR(255), 
    sub_category VARCHAR(255), 
    status VARCHAR(255) CHECK (status IN ('processing', 'completed', 'failed')) DEFAULT 'processing',
    created_at TIMESTAMP DEFAULT NOW()
);
