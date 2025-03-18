CREATE OR REPLACE VIEW service_tickets_with_user_details AS
SELECT 
    st.id AS ticket_id,
    st.query_id,
    st.department,
    st.service_type,
    st.request_category,
    st.routing_destination,
    st.ticket_priority,
    st.ticket_status,
    st.appointment_type,
    st.escalation_level,
    st.resolved_by,
    st.resolution_notes,
    st.created_at AS ticket_created_at,
    st.updated_at AS ticket_updated_at,
    -- Query details
    q.query_type,
    q.query_text,
    q.predefined_query,
    q.video_url,
    q.transcribed_text,
    q.translated_text,
    q.status AS query_status,
    -- User details
    u.id AS user_id,
    u.name AS user_name,
    u.mobile_number,
    u.email,
    u.aadhar_number,
    u.pan_number,
    u.occupation,
    u.annual_income,
    u.marital_status,
    u.kyc_status,
    u.registration_status,
    u.status AS user_status,
    -- Employee details
    e.id AS employee_id,
    e.name AS employee_name,
    e.email AS employee_email
FROM "service_tickets" st
JOIN "queries" q ON st.query_id = q.id
JOIN "users" u ON q.user_id = u.id
LEFT JOIN "employees" e ON st.assigned_to = e.id;

-- Add comment to the view
COMMENT ON VIEW service_tickets_with_user_details IS 'View that combines service tickets with related query and user information';