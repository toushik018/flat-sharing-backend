import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FlatShareRequestService } from "./flatRequest.service";
import httpStatus from "http-status";


const submitFlatRequest = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user.id;

    const result = await FlatShareRequestService.submitFlatShareRequest(
        req.body,
        userId
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Flat share request submitted successfully',
        data: result,
    });
});


const getUserFlatShareRequests = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.id;

    const result = await FlatShareRequestService.getUserFlatShareRequests(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Flat share requests retrieved successfully',
        data: result,
    });
});

const updateFlatShareRequestStatus = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user.id;
    const { requestId, status } = req.body;

    const updatedRequest = await FlatShareRequestService.updateFlatShareRequestStatus({ requestId, status, userId });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Flat share request status updated successfully',
        data: updatedRequest,
    });
});


const getRequestsForFlat = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user.id;

    const result = await FlatShareRequestService.getRequestsForFlat(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Flats with requests retrieved successfully',
        data: result,
    });
});



export const FlatShareRequestControllers = {
    submitFlatRequest,
    getUserFlatShareRequests,
    updateFlatShareRequestStatus,
    getRequestsForFlat
} 