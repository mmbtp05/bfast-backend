export interface AuthLoginBody {
    type: "phone_number" | "email";
    email?: string;
    password?: string;
    phone_number?: string;
    otp?: string;
}