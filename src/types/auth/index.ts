export interface AuthLoginBody {
    type: "phone_number" | "email";
    email?: string;
    password?: string;
    phone_number?: string;
    otp?: string;
    session_uuid?: string | null;
}

export interface AuthRegisterBody {
    first_name: string;
    last_name: string;
    company_name: string;
    phone_number: string;
    email: string;
    password: string;
    parcels_per_month: string;
    otp?: string | null;
    session_uuid?: string | null;
}