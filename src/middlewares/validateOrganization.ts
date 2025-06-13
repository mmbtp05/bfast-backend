import prisma from "../config/db";
import { CustomRequest } from "../types/customRequest";
import { Response, NextFunction } from "express";
import { AppError } from "../utils/customErrors";
import { ErrorCode } from "../types/error";

export const validateOrganization = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.org_id) {
            throw new AppError("Organization ID is required.", ErrorCode.INVALID_PAYLOAD);
        }

        const isBelongToOrg = await prisma.user.findUnique({
            where: {
                id: req.user_id,
                org_id: req.org_id
            }
        })

        if(!isBelongToOrg) {
            throw new AppError("You do not belong to this organization.", ErrorCode.VALIDATION_FAILED);
        }

        next();
    } catch (error) {
        return next(error);
    }
}

