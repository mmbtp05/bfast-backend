import express, { RequestHandler } from "express";
import { getBusinessInfo, patchBusinessInfo, sentAadharOtp, verifyAadharOtp, verifyGstin, verifyPan } from "../../../controllers/v1/kyc";
import { isAuthenticate } from "../../../middlewares/auth";
import { isKycDone } from "../../../middlewares/isKycDone";

const router = express.Router();

router.use(isAuthenticate as RequestHandler);
router.get('/kyc/business-info', getBusinessInfo as RequestHandler);

router.use(isKycDone as RequestHandler);
router.patch('/kyc/business-info', patchBusinessInfo as RequestHandler);
router.post('/kyc/aadhar/otp', sentAadharOtp as RequestHandler);
router.post('/kyc/aadhar/verify', verifyAadharOtp as RequestHandler);
router.post('/kyc/gstin/verify', verifyGstin as RequestHandler);
router.post('/kyc/pan/verify', verifyPan as RequestHandler);


export default router;