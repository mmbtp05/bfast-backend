import { Response, NextFunction } from "express";
import { UnauthorizedError } from "../utils/customErrors";
import jwt, { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';
import { CustomRequest } from "../types/customRequest";
import prisma from "../config/db";
import { UserType } from "../utils/constants";

interface CustomJwtPayload extends JwtPayload {
    user_id: string;
    org_id: string;
    permissions: string[];
    token?: string;
    jti?: string;
    user_type?: UserType;
}

export const isAuthenticate = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ");

    if (!token) {
        throw new UnauthorizedError("Auth token not provided.")
    }

    try {
        const decoded = jwt.verify(token[1], process.env.TOKEN_KEY ?? "") as CustomJwtPayload;
        req.user_id = decoded.user_id
        req.permissions = decoded.permissions
        req.org_id = decoded.org_id
        req.token = token[1]
        req.jti = decoded.jti
        req.user_type = decoded.user_type

        const isBlacklisted = await prisma.jWTBlacklist.findUnique({
            where: {
                jti: decoded.jti
            }
        })

        if (isBlacklisted || decoded.iss !== "backend.bfast") {
            throw new UnauthorizedError("Invalid token. Unauthorized.")
        }

        next();
    } catch (error) {
        return next(error);
    }
}