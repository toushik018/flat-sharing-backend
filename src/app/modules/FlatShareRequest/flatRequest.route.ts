import auth from "../../middleware/auth";
import express from "express"
import { FlatShareRequestControllers } from "./flatRequest.controller";

const router = express.Router();

router.get('/flat-requests', auth(), FlatShareRequestControllers.getUserFlatShareRequests);
router.post('/flat-request', auth(), FlatShareRequestControllers.submitFlatRequest);
router.patch('/flat-request/status', auth(), FlatShareRequestControllers.updateFlatShareRequestStatus);


export const bookingRoutes = router;