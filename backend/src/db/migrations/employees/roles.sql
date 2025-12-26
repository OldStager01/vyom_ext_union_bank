    CREATE TABLE roles (
        role_id SERIAL PRIMARY KEY,
        role_name VARCHAR(100) UNIQUE NOT NULL,
        role_level INT CHECK (role_level BETWEEN 1 AND 4),
        department VARCHAR(50) CHECK (department IN ('loans', 'operations')),
        branch_level BOOLEAN DEFAULT FALSE
    );

    INSERT INTO roles (role_name, role_level, department, branch_level) VALUES
        ('branch_teller', 1, 'operations', TRUE),
        ('customer_service_rep', 1, 'operations', TRUE),
        ('call_center_agent', 1, 'operations', FALSE),
        ('loan_officer', 1, 'loans', TRUE),
        ('branch_manager', 2, 'operations', TRUE),
        ('technical_support', 2, 'operations', FALSE),
        ('complaint_officer', 2, 'operations', TRUE),
        ('loan_manager', 2, 'loans', TRUE),
        ('regional_operations_manager', 3, 'operations', FALSE),
        ('fraud_investigator', 3, 'operations', FALSE),
        ('it_manager', 3, 'operations', FALSE),
        ('credit_risk_analyst', 3, 'loans', FALSE),
        ('regional_loan_head', 3, 'loans', FALSE),
        ('compliance_officer', 4, 'operations', FALSE),
        ('risk_management', 4, 'operations', FALSE),
        ('legal_team', 4, 'operations', FALSE),
        ('risk_management_head', 4, 'loans', FALSE),
        ('loans_compliance_officer', 4, 'loans', FALSE);
