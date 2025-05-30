import { Response, NextFunction } from "express";
import { UnauthorizedError } from "../utils/customErrors";
import jwt, { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';
import { CustomRequest } from "../types/customRequest";
import prisma from "../config/db";

interface CustomJwtPayload extends JwtPayload {
    user_id: string;
    org_id: string;
    permissions: string[];
    token?: string;
    jti?: string;
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

        const isBlacklisted = await prisma.jWTBlacklist.findUnique({
            where: {
                jti: decoded.jti
            }
        })

        if (isBlacklisted || decoded.iss !== "backend.bfast") {
            throw new UnauthorizedError("Invalid token. Unauthorized.")
        }

        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return next(new UnauthorizedError("Token has expired. Please log in again."));
        } else if (error.name === "JsonWebTokenError") {
            return next(new UnauthorizedError("Invalid token. Unauthorized."));
        }

        return next(error);
    }
}