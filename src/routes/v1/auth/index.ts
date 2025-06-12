import express, { RequestHandler } from 'express';
import { addOrgUsers, changePassword, getPermissions, getOrgUsers, login, logout, register, updateOrgUser } from '../../../controllers/v1/auth';
import { isAuthenticate } from '../../../middlewares/auth';

const router = express.Router();

router.post('/auth/register', register as RequestHandler);
router.post('/auth/login', login as RequestHandler);
router.use(isAuthenticate);
router.post('/auth/logout', logout as RequestHandler);
router.route('/auth/user').post(addOrgUsers as RequestHandler).get(getOrgUsers as RequestHandler);
router.patch('/auth/user/:id', updateOrgUser as RequestHandler);
router.post('/auth/change-password', changePassword as RequestHandler);
router.get('/auth/permissions', getPermissions as RequestHandler);

export default router;