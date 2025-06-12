import { Request } from "express";
import { UserType } from "../../utils/constants";

export interface CustomRequest extends Request {
    user_id?: string;
    org_id?: string;
    permissions?: string[];
    token?: string;
    jti?: string;
    user_type?: UserType;
}
