import { Response, NextFunction } from "express";
import prisma from "../../../config/db";
import { CustomRequest } from "../../../types/customRequest";
import { AppError } from "../../../utils/customErrors";
import { ErrorCode } from "../../../types/error";
import { Prisma } from "../../../../generated/prisma";

export const updateOrganizationAddress = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const {
        // Pickup address fields
        pickup_address,
        pickup_landmark,
        pickup_pincode,
        pickup_city,
        pickup_state,
        pickup_lat,
        pickup_long,
        pickup_username,
        pickup_user_number,

        // Return/RTO address fields
        return_address,
        return_landmark,
        return_pincode,
        return_city,
        return_state,
        return_lat,
        return_long,
        return_username,
        return_user_number
    } = req.body;

    try {
        const updatedOrganizationAddress = await prisma.organization.update({
            where: { id: req.org_id },
            data: {
                pickup_address: pickup_address ?? Prisma.skip,
                pickup_landmark: pickup_landmark ?? Prisma.skip,
                pickup_pincode: pickup_pincode ?? Prisma.skip,
                pickup_city: pickup_city ?? Prisma.skip,
                pickup_state: pickup_state ?? Prisma.skip,
                pickup_lat: pickup_lat ?? Prisma.skip,
                pickup_long: pickup_long ?? Prisma.skip,
                pickup_username: pickup_username ?? Prisma.skip,
                pickup_user_number: pickup_user_number ?? Prisma.skip,
                return_address: return_address ?? Prisma.skip,
                return_landmark: return_landmark ?? Prisma.skip,
                return_pincode: return_pincode ?? Prisma.skip,
                return_city: return_city ?? Prisma.skip,
                return_state: return_state ?? Prisma.skip,
                return_lat: return_lat ?? Prisma.skip,
                return_long: return_long ?? Prisma.skip,
                return_username: return_username ?? Prisma.skip,
                return_user_number: return_user_number ?? Prisma.skip
            },
            select: {
                id: true,
                pickup_address: true,
                pickup_landmark: true,
                pickup_pincode: true,
                pickup_city: true,
                pickup_state: true,
                pickup_lat: true,
                pickup_long: true,
                pickup_username: true,
                pickup_user_number: true,
                return_address: true,
                return_landmark: true,
                return_pincode: true,
                return_city: true,
                return_state: true,
                return_lat: true,
                return_long: true,
                return_username: true,
                return_user_number: true
            }
        });

        return res.status(200).json({
            success: true,
            status_code: 200,
            data: updatedOrganizationAddress
        });
    } catch (error) {
        next(error);
    }
};

export const getOrganizationAddress = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const orgAddress = await prisma.organization.findUnique({
            where: { id: req.org_id },
            select: {
                id: true,
                pickup_address: true,
                pickup_landmark: true,
                pickup_pincode: true,
                pickup_city: true,
                pickup_state: true,
                pickup_lat: true,
                pickup_long: true,
                pickup_username: true,
                pickup_user_number: true,
                return_address: true,
                return_landmark: true,
                return_pincode: true,
                return_city: true,
                return_state: true,
                return_lat: true,
                return_long: true,
                return_username: true,
                return_user_number: true
            }
        });

        return res.status(200).json({
            success: true,
            status_code: 200,
            data: orgAddress
        });
    } catch (error) {
        next(error);
    }
};