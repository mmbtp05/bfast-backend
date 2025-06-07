import express, { RequestHandler } from 'express';
import { addUsers, changePassword, getPermissions, getUsers, login, logout, register } from '../../../controllers/v1/auth';
import { isAuthenticate } from '../../../middlewares/auth';

const router = express.Router();

router.post('/auth/register', register as RequestHandler);
router.post('/auth/login', login as RequestHandler);
router.use(isAuthenticate);
router.post('/auth/logout', logout as RequestHandler);
router.route('/auth/user').post(addUsers as RequestHandler).get(getUsers as RequestHandler);
router.post('/auth/change-password', changePassword as RequestHandler);
router.get('/auth/permissions', getPermissions as RequestHandler);

export default router;