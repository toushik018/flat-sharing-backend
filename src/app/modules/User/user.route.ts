import express from 'express'
import { userControllers } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { userValidationSchema } from './user.validation';

const router = express.Router();


router.post('/register', validateRequest(userValidationSchema.createUserSchema),
    userControllers.createUser);

router.post('/admin-register', validateRequest(userValidationSchema.createAdminSchema),
    userControllers.createAdmin);


export const userRoutes = router;