import express from 'express'
import { userControllers } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { userValidationSchema } from './user.validation';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();



router.get('/users', auth(UserRole.ADMIN), userControllers.getAllUsers);
router.patch('/update-role', auth('ADMIN'), userControllers.updateUserRole);
router.patch('/update-status', auth('ADMIN'), userControllers.updateUserStatus);
router.post('/register', validateRequest(userValidationSchema.createUserSchema),
    userControllers.createUser);

router.post('/admin-register',
    // validateRequest(userValidationSchema.createAdminSchema),
    userControllers.createAdmin);


export const userRoutes = router;