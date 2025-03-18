import { RoleSchema } from "../../schemas/role.schema";
import { z } from "zod";

export type RoleType = z.infer<typeof RoleSchema>;

export type RoleName =
    | "branch_teller"
    | "customer_service_rep"
    | "call_center_agent"
    | "loan_officer"
    | "branch_manager"
    | "technical_support"
    | "complaint_officer"
    | "loan_manager"
    | "regional_operations_manager"
    | "fraud_investigator"
    | "it_manager"
    | "credit_risk_analyst"
    | "regional_loan_head"
    | "compliance_officer"
    | "risk_management"
    | "legal_team"
    | "risk_management_head"
    | "loans_compliance_officer";
