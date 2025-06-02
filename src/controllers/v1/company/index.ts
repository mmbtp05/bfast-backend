import prisma from "../../../config/db";
import { NextFunction, Response } from "express";
import { AddUserBody, AuthLoginBody, AuthRegisterBody } from "../../../types/auth";
import { AppError } from "../../../utils/customErrors";
import { ErrorCode } from "../../../types/error";
import { CustomRequest } from "../../../types/customRequest";
import { v4 as uuidv4 } from 'uuid';

export const getCompanyDetails = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const details = await prisma.organization.findUnique({
            where: {
                id: req.org_id
            },
            select: {
                id: true,
                company_name: true,
                brand_name: true,
                company_logo: true,
                company_email: true
            }
        })

        return res.status(200).json({
            success: true,
            status_code: 200,
            data: details
        })
    } catch (error) {
        next(error)
    }
}

export const updateCompanyDetails = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { company_name, brand_name, company_email } = req.body;
        const updateData: any = {};
        
        if (company_name !== undefined) updateData.company_name = company_name;
        if (brand_name !== undefined) updateData.brand_name = brand_name;
        if (company_email !== undefined) updateData.company_email = company_email;

        // Check if there's at least one field to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                status_code: 400,
                message: "No fields provided for update"
            });
        }

        // Optional: Add validation for email format
        if (company_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company_email)) {
            return res.status(400).json({
                success: false,
                status_code: 400,
                message: "Invalid email format"
            });
        }

        const updatedDetails = await prisma.organization.update({
            where: {
                id: req.org_id
            },
            data: updateData,
            select: {
                id: true,
                company_name: true,
                brand_name: true,
                company_logo: true,
                company_email: true
            }
        });

        return res.status(200).json({
            success: true,
            status_code: 200,
            message: "Company details updated successfully",
            data: updatedDetails
        });

    } catch (error) {
        next(error);
    }
}

