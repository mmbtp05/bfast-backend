// Business Categories Constants
export const BusinessCategories = {
    SOLE: "SOLE",
    INDIVIDUAL: "INDIVIDUAL", 
    COMPANY: "COMPANY"
} as const;

export type BusinessCategories = "SOLE" | "INDIVIDUAL" | "COMPANY";

// Bank Account Types Constants
export const BankAccountTypes = {
    SAVING: "SAVING",
    CURRENT: "CURRENT"
} as const;

export type BankAccountTypes = "SAVING" | "CURRENT";

// Role Scope Constants
export const RoleScope = {
    GLOBAL: "GLOBAL",
    ORGANIZATION: "ORGANIZATION"
} as const;

export type RoleScope = "GLOBAL" | "ORGANIZATION";

// Roles Constants
export const Roles = {
    SUPERADMIN: "SUPERADMIN",
    ADMIN: "ADMIN",
    EXECUTIVE: "EXECUTIVE",
    OTHERS: "OTHERS"
} as const;

export type Roles = "SUPERADMIN" | "ADMIN" | "EXECUTIVE" | "OTHERS";

// User Type Constants
export const UserType = {
    BUSINESS: "BUSINESS",
    INDIVIDUAL: "INDIVIDUAL"
} as const;

export type UserType = "BUSINESS" | "INDIVIDUAL";