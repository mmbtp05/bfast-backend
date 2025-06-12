import axios from "axios";
import prisma from "../../../config/db";
import { CustomRequest } from "../../../types/customRequest";
import { NextFunction, Response } from "express";

export const patchBusinessInfo = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { business_category, business_subcategory } = req.body

    try {
        await prisma.organization.update({
            where: {
                id: req.org_id
            },
            data: {
                business_category,
                business_subcategory
            }
        })

        return res.status(200).json({ success: true, status_code: 200, message: 'Business info inserted succesfull.' })
    } catch (error) {
        next(error)
    }
}

export const sentAadharOtp = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { aadhaar_number } = req.body

    try {
        const sendOtp = await axios.post('https://sandbox.cashfree.com/verification/offline-aadhaar/otp', {
            aadhaar_number
        }, {
            headers: {
                'x-client-id': process.env.CASHFREE_CLIENT_ID,
                'x-client-secret': process.env.CASHFREE_CLIENT_SECRET
            }
        })

        return res.status(200).json({ success: true, status_code: 200, data: sendOtp.data })
    } catch (error: any) {
        next(error)
    }
}

export const verifyAadharOtp = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { ref_id, otp } = req.body

    try {
        const verifyOtp = await axios.post('https://sandbox.cashfree.com/verification/offline-aadhaar/verify', {
            ref_id, otp
        }, {
            headers: {
                'x-client-id': process.env.CASHFREE_CLIENT_ID,
                'x-client-secret': process.env.CASHFREE_CLIENT_SECRET
            }
        })

        return res.status(200).json({ success: true, status_code: 200, data: verifyOtp.data })
    } catch (error: any) {
        next(error)
    }
}

export const verifyGstin = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { gstin } = req.body

    try {
        const verifyGSTIN = await axios.post('https://sandbox.cashfree.com/verification/gstin', {
            GSTIN: gstin
        }, {
            headers: {
                'x-client-id': process.env.CASHFREE_CLIENT_ID,
                'x-client-secret': process.env.CASHFREE_CLIENT_SECRET
            }
        })

        return res.status(200).json({ success: true, status_code: 200, data: verifyGSTIN.data })
    } catch (error: any) {
        next(error)
    }
}

export const verifyPan = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { pan, name } = req.body

    try {
        const verifyPan = await axios.post('https://sandbox.cashfree.com/verification/pan', {
            pan, name
        }, {
            headers: {
                'x-client-id': process.env.CASHFREE_CLIENT_ID,
                'x-client-secret': process.env.CASHFREE_CLIENT_SECRET
            }
        })

        return res.status(200).json({ success: true, status_code: 200, data: verifyPan.data })
    } catch (error: any) {
        next(error)
    }
}