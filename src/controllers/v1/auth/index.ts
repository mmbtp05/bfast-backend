import prisma from "../../../config/db";
import { NextFunction, Response } from "express";
import { AddUserBody, AuthLoginBody, AuthRegisterBody } from "../../../types/auth";
import { AppError } from "../../../utils/customErrors";
import { ErrorCode } from "../../../types/error";
import { checkPassword, hashPassword } from "../../../utils/passwordUtility";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../../../types/customRequest";
import { v4 as uuidv4 } from 'uuid';

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

            if (!user.is_active) {
                throw new AppError("User is not active.", ErrorCode.ACCOUNT_SUSPENDED);
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

            if (!user.is_active) {
                throw new AppError("User is not active.", ErrorCode.ACCOUNT_SUSPENDED);
            }
        }

        const userPermissions = user?.permissions?.map(per => per?.permission?.tag)

        const jwtid = uuidv4();

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
                jwtid
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

        const createOrg = await prisma.organization.create({ data: { company_name, parcels_per_month, company_email: email } })

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
                email,
                buyer_detail_access: true
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

        const jwtid = uuidv4();

        const access_token = jwt.sign(
            {
                permissions: userPermissions,
                user_id: createUser?.id,
                org_id: createOrg?.id
            },
            process.env.TOKEN_KEY ?? "",
            {
                expiresIn: '24h',
                issuer: "backend.bfast",
                jwtid
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

export const addUsers = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { first_name, last_name, email, role, permissions, buyer_detail_access } = req.body as AddUserBody

    try {
        if (!first_name || !last_name || !email || !role || !permissions || !buyer_detail_access) {
            throw new AppError("Please mention all the fields", ErrorCode.INVALID_PAYLOAD)
        }

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomPass = '';
        for (let i = 0; i < 10; i++) {
            randomPass += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        await prisma.user.create({
            data: {
                first_name,
                last_name,
                permissions: {
                    createMany: {
                        data: permissions?.map(per => ({ permission_id: per }))
                    }
                },
                email,
                role,
                password: randomPass,
                org_id: req.org_id ?? "",
                scope: "ORGANIZATION",
                buyer_detail_access,
                is_active: true
            }
        })

        return res.status(200).json({ success: true, success_code: 200, message: 'User added successfully!' })
    } catch (error) {
        next(error)
    }
}

export const changePassword = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { old_password, new_password, confirm_password } = req.body

    try {
        if (!old_password || !confirm_password || !new_password) {
            throw new AppError("Please mention all the fields.", ErrorCode.INVALID_PAYLOAD)
        }

        if (new_password !== confirm_password) {
            throw new AppError("New and confirm new password does not match.", ErrorCode.INVALID_PAYLOAD)
        }

        const checkOldPassword = await prisma.user.findUnique({
            where: {
                id: req.user_id
            },
            select: {
                password: true
            }
        })

        if (! await checkPassword(old_password, checkOldPassword?.password ?? "")) {
            throw new AppError("Incorrect Old Password.", ErrorCode.USER_NOT_FOUND)
        }

        const hash_pass = await hashPassword(new_password)

        await prisma.user.update({
            where: {
                id: req.user_id
            },
            data: {
                password: hash_pass
            }
        })

        return res.status(200).json({ success: true, status_code: 200, message: 'Password change successfully!' });
    } catch (error) {
        next(error)
    }
}
