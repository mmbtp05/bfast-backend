import express, { RequestHandler } from 'express';
import { isAuthenticate } from '../../../middlewares/auth';
import { getBillingAddress, getCompanyDetails, getInvoiceSettings, updateBillingAddress, updateCompanyDetails, updateInvoiceSettings } from '../../../controllers/v1/company';

const router = express.Router();

router.use(isAuthenticate);
router.route('/company/info')
    .get(getCompanyDetails as RequestHandler)
    .patch(updateCompanyDetails as RequestHandler);
router.route('/company/billing-address')
    .get(getBillingAddress as RequestHandler)
    .patch(updateBillingAddress as RequestHandler);
router.route('/company/invoice-setting')
    .get(getInvoiceSettings as RequestHandler)
    .patch(updateInvoiceSettings as RequestHandler);

export default router;