import prisma from "../../../config/db";
import { NextFunction, Response } from "express";
import { AuthLoginBody, AuthRegisterBody } from "../../../types/auth";
import { AppError } from "../../../utils/customErrors";
import { ErrorCode } from "../../../types/error";
import { checkPassword, hashPassword } from "../../../utils/passwordUtility";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../../../types/customRequest";
import uuid from 'uuid';

export const login = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { type, phone_number, otp, session_uuid, email, password } = req.body as AuthLoginBody;

    try {
        let user;

        if (type === "email") {
            if (!email || !password) {
                throw new AppError("Email and password are required for email authentication.", ErrorCode.INVALID_PAYLOAD);
            }

            user = await prisma.user.findUnique({
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
            if (!phone_number) {
                throw new AppError("Phone number is required for authentication.", ErrorCode.INVALID_PAYLOAD);
            }

            user = await prisma.user.findUnique({
                where: { phone_number },
                include: { permissions: { include: { permission: { select: { tag: true } } } } }
            });

            if (!user) {
                throw new AppError("User not found with the provided phone number.", ErrorCode.USER_NOT_FOUND);
            }

            if (!otp) {
                return res.status(200).json({ success: true, status_code: 200, message: "Otp Send Successfully!", data: { session_uuid: "9ac065e5-536c-4ac5-a94d-c164fe7485cd" } })
            }

            if (!session_uuid || otp !== "123456") {
                throw new AppError("Invalid OTP!", ErrorCode.INVALID_OTP)
            }
        }

        const userPermissions = user?.permissions?.map(per => per?.permission?.tag)

        const access_token = jwt.sign(
            {
                permissions: userPermissions,
                user_id: user?.id,
                org_id: user?.org_id
            },
            process.env.TOKEN_KEY ?? "",
            {
                expiresIn: '24h',
                issuer: "backend.bfast",
                jwtid: uuid.v4()
            }
        )

        return res.status(200).json({
            success: true,
            status_code: 200,
            data: {
                id: user?.id,
                org_id: user?.org_id,
                role: user?.role,
                user_permissions: userPermissions,
                access_token
            }
        })
    } catch (error) {
        next(error);
    }
}


export const register = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { first_name, last_name, company_name, phone_number, email, password, parcels_per_month, otp, session_uuid } = req.body as AuthRegisterBody;

    try {
        if (!first_name || !last_name || !company_name || !phone_number || !email || !password || !parcels_per_month) {
            throw new AppError("Please mention all information.", ErrorCode.INVALID_PAYLOAD)
        }

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

        if (!otp) {
            return res.status(200).json({ success: true, status_code: 200, message: "Otp Send Successfully!", data: { session_uuid: "9ac065e5-536c-4ac5-a94d-c164fe7485cd" } })
        }

        if (session_uuid && otp !== "123456") {
            throw new AppError("Invalid Otp", ErrorCode.INVALID_OTP)
        }

        const createOrg = await prisma.organization.create({ data: { company_name, parcels_per_month } })

        const hash_pass = await hashPassword(password)

        const createUser = await prisma.user.create({
            data: {
                org_id: createOrg.id,
                role: "ADMIN",
                scope: "ORGANIZATION",
                password: hash_pass,
                first_name,
                last_name,
                phone_number,
                email
            }
        })

        const allPermissions = await prisma.permissions.findMany({
            select: { id: true, tag: true }
        });

        const permissionMappings = allPermissions.map(p => ({
            user_id: createUser.id,
            permission_id: p.id,
        }));

        await prisma.userPermissions.createMany({
            data: permissionMappings
        });

        const userPermissions = allPermissions.map(per => per.tag)

        const access_token = jwt.sign(
            {
                permissions: userPermissions,
                user_id: createUser?.id,
                org_id: createOrg?.id
            },
            process.env.TOKEN_KEY ?? "",
            {
                expiresIn: '24h',
                issuer: "backend.bfast"
            }
        )

        return res.status(200).json({
            success: true,
            status_code: 200,
            data: {
                id: createUser?.id,
                org_id: createOrg?.id,
                role: createUser?.role,
                user_permissions: userPermissions,
                access_token
            }
        });
    } catch (error) {
        next(error)
    }
}

export const logout = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        await prisma.jWTBlacklist.create({
            data: {
                token: req.token ?? "",
                user_id: req.user_id ?? "",
                jti: req.jti ?? ""
            }
        })

        return res.status(200).json({
            success: true,
            status_code: 200,
            message: "Logout Successfully!"
        })
    } catch (error) {
        next(error)
    }
}
