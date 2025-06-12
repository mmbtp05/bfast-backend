export const UserType = {
    BUSINESS: "BUSINESS",
    INDIVIDUAL: "INDIVIDUAL"
} as const;

export type UserType = "BUSINESS" | "INDIVIDUAL";
