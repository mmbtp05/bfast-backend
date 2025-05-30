import express, { RequestHandler } from 'express';
import { login, logout, register } from '../../../controllers/v1/auth';
import { isAuthenticate } from '../../../middlewares/auth';

const router = express.Router();

router.post('/auth/register', register as RequestHandler);
router.post('/auth/login', login as RequestHandler);
router.post('/auth/logout', isAuthenticate, logout as RequestHandler);

export default router;