import express, { RequestHandler } from "express";
import { isAuthenticate } from "../../../middlewares/auth";
import { getOrganizationAddress, updateOrganizationAddress } from "../../../controllers/v1/addresses";

const router = express.Router();

router.use(isAuthenticate);
router.route('/address')
    .patch(updateOrganizationAddress as RequestHandler)
    .get(getOrganizationAddress as RequestHandler);


export default router;