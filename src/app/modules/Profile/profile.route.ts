
import express from 'express';
import auth from '../../middleware/auth';
import { ProfileControllers } from './profile.controller';

const router = express.Router();

router.get('/profile', auth(), ProfileControllers.getUserProfile);
router.put('/profile', auth(), ProfileControllers.updateUserProfile);


export const profileRoutes = router;