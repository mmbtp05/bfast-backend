// Business Categories Constants
export const businessCategories = {
    SOLE: "SOLE",
    INDIVIDUAL: "INDIVIDUAL", 
    COMPANY: "COMPANY"
} as const;

export type BusinessCategories = "SOLE" | "INDIVIDUAL" | "COMPANY";

// Bank Account Types Constants
export const bankAccountTypes = {
    SAVING: "SAVING",
    CURRENT: "CURRENT"
} as const;

export type BankAccountTypes = "SAVING" | "CURRENT";

// Role Scope Constants
export const roleScope = {
    GLOBAL: "GLOBAL",
    ORGANIZATION: "ORGANIZATION"
} as const;

export type RoleScope = "GLOBAL" | "ORGANIZATION";

// Roles Constants
export const roles = {
    SUPERADMIN: "SUPERADMIN",
    ADMIN: "ADMIN",
    EXECUTIVE: "EXECUTIVE",
    OTHERS: "OTHERS"
} as const;

export type Roles = "SUPERADMIN" | "ADMIN" | "EXECUTIVE" | "OTHERS";

// User Type Constants
export const userType = {
    BUSINESS: "BUSINESS",
    INDIVIDUAL: "INDIVIDUAL"
} as const;

export type UserType = "BUSINESS" | "INDIVIDUAL";

// Transport Modes
export const transportMode = {
    EXPRESS: "EXPRESS",
    SURFACE: "SURFACE"
} as const;

export type TransportMode = "EXPRESS" | "SURFACE";

//Shipment Type
export const shipmentType = {
    FORWARD: "FORWARD",
    RTO: "RTO",
    REVERSE: "REVERSE"
} as const;

export type ShipmentType = "FORWARD" | "RTO" | "REVERSE";