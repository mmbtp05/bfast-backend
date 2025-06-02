import express, { RequestHandler } from 'express';
import { addUsers, changePassword, login, logout, register } from '../../../controllers/v1/auth';
import { isAuthenticate } from '../../../middlewares/auth';

const router = express.Router();

router.post('/auth/register', register as RequestHandler);
router.post('/auth/login', login as RequestHandler);
router.use(isAuthenticate);
router.post('/auth/logout', logout as RequestHandler);
router.post('/auth/add-user', addUsers as RequestHandler);
router.post('/auth/change-password', changePassword as RequestHandler);

export default router;