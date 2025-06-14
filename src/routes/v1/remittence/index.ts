import express, { RequestHandler } from "express";
import { isAuthenticate } from "../../../middlewares/auth";
import { getRemittanceInfo, upsertRemmittenceInfo } from "../../../controllers/v1/remittence";

const router = express.Router();

router.use(isAuthenticate);
router.route('/remittence')
    .patch(upsertRemmittenceInfo as RequestHandler)
    .get(getRemittanceInfo as RequestHandler);


export default router;