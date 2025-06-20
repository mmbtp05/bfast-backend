import prisma from "../../../config/db";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../../../types/customRequest";

export const getCourierList = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const couriers = await prisma.couriers.findMany();

        return res.status(200).json({
            success: true,
            status_code: 200,
            data: couriers
        });
    } catch (error) {
        next(error)
    }
}
