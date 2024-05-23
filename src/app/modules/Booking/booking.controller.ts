import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";
import httpStatus from "http-status";

const flatBooking = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { flatId } = req.body;
    const userId = req.user.id;
    const result = await BookingServices.flatBooking(flatId, userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking requests submitted successfully",
        data: result
    })
});



const getBookingRequests = catchAsync(async (req: Request, res: Response) => {

    const result = await BookingServices.getBookingRequests();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking requests retrieved successfully",
        data: result
    })
});







const updateBookingRequests = catchAsync(async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const { status } = req.body;
    const result = await BookingServices.updateBookingRequest(bookingId, status);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking request updated successfully",
        data: result
    })
});


export const BookingControllers = {
    flatBooking,
    getBookingRequests,
    updateBookingRequests
} 