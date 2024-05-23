import auth from "../../middleware/auth";
import express from "express"
import { BookingControllers } from "./booking.controller";

const router = express.Router();


router.post('/booking-applications', auth(), BookingControllers.flatBooking);
router.get('/booking-requests', auth(), BookingControllers.getBookingRequests);
router.put('/booking-requests/:bookingId', auth(), BookingControllers.updateBookingRequests);

export const bookingRoutes = router;