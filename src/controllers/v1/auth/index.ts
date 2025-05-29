import prisma from "../../../config/db";
import { NextFunction, Request, Response } from "express";
import { AuthLoginBody } from "../../../types/auth";
import { AppError } from "../../../utils/customErrors";
import { ErrorCode } from "../../../types/error";
import { enhance } from "@zenstackhq/runtime";
import { checkPassword } from "../../../utils/passwordUtility";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { type, phone_number, otp, email, password } = req.body as AuthLoginBody;

    try {
        let user;

        if (type === "email") {
            if (!email || !password) {
                throw new AppError("Email and password are required for email authentication.", ErrorCode.INVALID_PAYLOAD);
            }

            const user = await prisma.user.findUnique({
                where: { email },
                include: { permissions: { include: { permission: { select: { tag: true } } } } }
            });

            if (!user) {
                throw new AppError("Invalid username or password.", ErrorCode.USER_NOT_FOUND);
            }

            if (! await checkPassword(password, user.password)) {
                throw new AppError("Invalid username or password.", ErrorCode.USER_NOT_FOUND);
            }
        } else if (type === "phone_number") {
            if (!phone_number || !otp) {
                throw new AppError("Phone number and OTP are required for phone number authentication.", ErrorCode.INVALID_PAYLOAD);
            }

            user = await prisma.user.findUnique({
                where: { phone_number },
                include: { permissions: { include: { permission: { select: { tag: true } } } } }
            });

            if (!user) {
                throw new AppError("User not found with the provided phone number.", ErrorCode.USER_NOT_FOUND);
            }

            if (!otp) {
                throw new AppError("Invalid OTP!", ErrorCode.INVALID_PAYLOAD)
            }
        }




    } catch (error) {
        next(error);
    }
}


export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { first_name, last_name, company_name, phone_number, email, password, parcels_per_month } = req.body

    try {
        const checkUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { phone_number },
                    { email }
                ]
            }
        });

        if (checkUser) {
            throw new AppError("User already exist with this email or phone.", ErrorCode.USER_ALREADY_EXISTS)
        }

        const createOrg = await prisma.organization.create({ data: { company_name } })

        const createUser = await prisma.user.create({
            data: {
                org_id: createOrg.id,
                role: "ADMIN",
                scope: "ORGANIZATION",
                password,
                first_name,
                last_name,
                phone_number,
            }
        })

        const allPermissions = await prisma.permissions.findMany({
            select: { id: true }
        });

        const permissionMappings = allPermissions.map(p => ({
            user_id: createUser.id,
            permission_id: p.id,
        }));

        await prisma.userPermissions.createMany({
            data: permissionMappings
        });

        return res.status(200).json({ success: true, status_code: 200, data: {} })
    } catch (error) {
        next(error)
    }
}

export const 