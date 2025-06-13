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

// // Optional: GET API to fetch address information
// export const getOrganizationAddress = async (req: CustomRequest, res: Response, next: NextFunction) => {
//     try {
//         const user_id = req.user?.user_id;
//         const org_id = req.user?.org_id;

//         if (!user_id || !org_id) {
//             throw new AppError("Unauthorized access.", ErrorCode.UNAUTHORIZED);
//         }

//         // Verify user belongs to the organization
//         const user = await prisma.user.findUnique({
//             where: { id: user_id },
//             select: { org_id: true, role: true }
//         });

//         if (!user || user.org_id !== org_id) {
//             throw new AppError("User not authorized for this organization.", ErrorCode.UNAUTHORIZED);
//         }

//         const organization = await prisma.organization.findUnique({
//             where: { id: org_id },
//             select: {
//                 id: true,
//                 // Pickup address fields
//                 pickup_address: true,
//                 pickup_landmark: true,
//                 pickup_pincode: true,
//                 pickup_city: true,
//                 pickup_state: true,
//                 pickup_lat: true,
//                 pickup_long: true,
//                 pickup_username: true,
//                 pickup_user_number: true,
//                 // Return address fields
//                 return_address: true,
//                 return_landmark: true,
//                 return_pincode: true,
//                 return_city: true,
//                 return_state: true,
//                 return_lat: true,
//                 return_long: true,
//                 return_username: true,
//                 return_user_number: true
//             }
//         });

//         if (!organization) {
//             throw new AppError("Organization not found.", ErrorCode.NOT_FOUND);
//         }

//         return res.status(200).json({
//             success: true,
//             status_code: 200,
//             message: "Address information retrieved successfully.",
//             data: {
//                 org_id: organization.id,
//                 pickup_address: {
//                     address: organization.pickup_address,
//                     landmark: organization.pickup_landmark,
//                     pincode: organization.pickup_pincode,
//                     city: organization.pickup_city,
//                     state: organization.pickup_state,
//                     latitude: organization.pickup_lat,
//                     longitude: organization.pickup_long,
//                     contact_person: organization.pickup_username,
//                     contact_number: organization.pickup_user_number
//                 },
//                 return_address: {
//                     address: organization.return_address,
//                     landmark: organization.return_landmark,
//                     pincode: organization.return_pincode,
//                     city: organization.return_city,
//                     state: organization.return_state,
//                     latitude: organization.return_lat,
//                     longitude: organization.return_long,
//                     contact_person: organization.return_username,
//                     contact_number: organization.return_user_number
//                 }
//             }
//         });

//     } catch (error) {
//         next(error);
//     }
// };