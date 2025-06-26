import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/customRequest";
import prisma from "../config/db";
import { ErrorCode } from "../types/error";
import { AppError } from "../utils/customErrors";

export const isKycDone = async (req: CustomRequest, res: Response, next: NextFunction) => {
   try {
        const organization = await prisma.organization.findUnique({
            where: {
                id: req.org_id
            },
            select: {
                is_kyc_done: true
            }
        });

        if (!organization) {
            throw new AppError("Organization not found.", ErrorCode.RECORD_NOT_FOUND);
        }

        if (organization.is_kyc_done) {
            return res.status(200).json({
                success: true,
                status_code: 200,  
                message: "KYC is already done for this organization."
            })
        }

        next();
   } catch (error) {
        return next(error);
   }
}