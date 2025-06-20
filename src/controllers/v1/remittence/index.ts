import prisma from "../../../config/db";
import { CustomRequest } from "../../../types/customRequest";
import { NextFunction, Response } from "express";
import { AppError } from "../../../utils/customErrors";
import { ErrorCode } from "../../../types/error";

export const upsertRemmittenceInfo = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const {
        account_number,
        account_type,
        beneficiary_name,
        ifsc_code,
        bank_name,
        branch_name
    } = req.body;

    try {
        // Validate required fields
        if (!account_number || !account_type || !beneficiary_name || !ifsc_code || !bank_name || !branch_name) {
            throw new AppError("All remittance fields are required except remittance_period.", ErrorCode.INVALID_PAYLOAD);
        }

        // Validate account_type enum
        if (!["SAVING", "CURRENT"].includes(account_type)) {
            throw new AppError("account_type must be either 'SAVING' or 'CURRENT'", ErrorCode.INVALID_PAYLOAD);
        }

        let remittanceData = {
            account_number,
            account_type,
            beneficiary_name,
            ifsc_code,
            bank_name,
            branch_name,
        };

        const remittanceInfo = await prisma.organizationRemittance.upsert({
            where: {
                org_id: req.org_id
            },
            create: {
                ...remittanceData,
                org_id: req.org_id ?? ""
            },
            update: {
                ...remittanceData
            }       
        })

        return res.status(200).json({
            success: true,
            status_code: 200,
            data: {
                id: remittanceInfo.id,
                account_number: remittanceInfo.account_number,
                account_type: remittanceInfo.account_type,
                beneficiary_name: remittanceInfo.beneficiary_name,
                ifsc_code: remittanceInfo.ifsc_code,
                bank_name: remittanceInfo.bank_name,
                branch_name: remittanceInfo.branch_name,
                remittance_period: remittanceInfo.remittance_period,
                org_id: remittanceInfo.org_id
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getRemittanceInfo = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const remittanceInfo = await prisma.organizationRemittance.findUnique({
            where: { org_id: req.org_id },
            select: {
                id: true,
                account_number: true,
                account_type: true,
                beneficiary_name: true,
                ifsc_code: true,
                bank_name: true,
                branch_name: true,
                remittance_period: true,
                org_id: true
            }
        });

        return res.status(200).json({
            success: true,
            status_code: 200,
            data: remittanceInfo
        });
    } catch (error) {
        next(error);
    }
};