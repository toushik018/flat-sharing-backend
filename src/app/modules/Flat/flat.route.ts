import express from 'express';
import { FlatControllers } from './flat.controller';
import auth from '../../middleware/auth';

const router = express.Router();



router.post('/flats', auth(), FlatControllers.addFlatIntoDB);
router.get('/flats', FlatControllers.getAllFlats);
router.put('/flats/:flatId', auth(), FlatControllers.updateFlat);




export const flatRoutes = router;