import express from 'express';
import { FlatControllers } from './flat.controller';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();



router.get('/flats',
    // auth(UserRole.ADMIN), 
    FlatControllers.getAllFlats);

router.get('/flat/:id', FlatControllers.getFlatPostById);
router.get('/my-flats', auth(), FlatControllers.getUserFlats);
router.put('/flats/:flatId', auth(), FlatControllers.updateFlat);
router.post('/flats', auth(), FlatControllers.addFlatIntoDB);
router.delete('/flats/:flatId', auth(UserRole.ADMIN, UserRole.USER), FlatControllers.deleteFlat);




export const flatRoutes = router;