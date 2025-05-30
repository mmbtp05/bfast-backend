import { Request } from "express";

export interface CustomRequest extends Request {
    user_id?: string;
    org_id?: string;
    permissions?: string[];
    token?: string;
    jti?: string;
}
