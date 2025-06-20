import prisma from "../../../config/db";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../../../types/customRequest";
import { Prisma } from "../../../../generated/prisma";

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
                company_email: true,
                company_website: true
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
        const { company_name, brand_name, company_email, company_website } = req.body;

        const updatedDetails = await prisma.organization.update({
            where: {
                id: req.org_id
            },
            data: {
                company_name: company_name ?? Prisma.skip,
                brand_name: brand_name ?? Prisma.skip,
                company_email: company_email ?? Prisma.skip,
                company_website: company_website ?? Prisma.skip,
            },
            select: {
                id: true,
                company_name: true,
                brand_name: true,
                company_logo: true,
                company_email: true,
                company_website: true
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

export const getBillingAddress = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const billingAddress = await prisma.organization.findUnique({
            where: {
                id: req.org_id
            },
            select: {
                id: true,
                billing_address: true,
                billing_address_landmark: true,
                billing_address_pincode: true,
                billing_address_city: true,
                billing_address_state: true,
                billing_address_contact_number: true
            }
        })

        return res.status(200).json({
            success: true,
            status_code: 200,
            data: billingAddress
        })
    } catch (error) {
        next(error)
    }
}

export const updateBillingAddress = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const {
            billing_address,
            billing_address_landmark,
            billing_address_pincode,
            billing_address_city,
            billing_address_state,
            billing_address_contact_number
        } = req.body;


        const updatedBillingAddress = await prisma.organization.update({
            where: {
                id: req.org_id
            },
            data: {
                billing_address: billing_address ?? Prisma.skip,
                billing_address_landmark: billing_address_landmark ?? Prisma.skip,
                billing_address_pincode: billing_address_pincode ?? Prisma.skip,
                billing_address_city: billing_address_city ?? Prisma.skip,
                billing_address_state: billing_address_state ?? Prisma.skip,
                billing_address_contact_number: billing_address_contact_number ?? Prisma.skip
            },
            select: {
                id: true,
                billing_address: true,
                billing_address_landmark: true,
                billing_address_pincode: true,
                billing_address_city: true,
                billing_address_state: true,
                billing_address_contact_number: true
            }
        });

        return res.status(200).json({
            success: true,
            status_code: 200,
            data: updatedBillingAddress
        });

    } catch (error) {
        next(error);
    }
}

export const getInvoiceSettings = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const invoiceSettings = await prisma.organization.findUnique({
            where: {
                id: req.org_id
            },
            select: {
                id: true,
                invoice_prefix: true,
                invoice_series_starting_from: true,
                invoice_cin_number: true,
                invoice_hide_buyer_contact: true,
                invoice_signature: true
            }
        })

        return res.status(200).json({
            success: true,
            status_code: 200,
            data: invoiceSettings
        })
    } catch (error) {
        next(error)
    }
}

export const updateInvoiceSettings = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const {
            invoice_prefix,
            invoice_series_starting_from,
            invoice_cin_number,
            invoice_hide_buyer_contact,
            invoice_signature
        } = req.body;

        const updatedInvoiceSettings = await prisma.organization.update({
            where: {
                id: req.org_id
            },
            data: {
                invoice_prefix: invoice_prefix ?? Prisma.skip,
                invoice_series_starting_from: invoice_series_starting_from ?? Prisma.skip,
                invoice_cin_number: invoice_cin_number ?? Prisma.skip,
                invoice_hide_buyer_contact: invoice_hide_buyer_contact ?? Prisma.skip,
                invoice_signature: invoice_signature ?? Prisma.skip
            },
            select: {
                id: true,
                invoice_prefix: true,
                invoice_series_starting_from: true,
                invoice_cin_number: true,
                invoice_hide_buyer_contact: true,
                invoice_signature: true
            }
        });

        return res.status(200).json({
            success: true,
            status_code: 200,
            message: "Invoice settings updated successfully",
            data: updatedInvoiceSettings
        });

    } catch (error) {
        next(error);
    }
}