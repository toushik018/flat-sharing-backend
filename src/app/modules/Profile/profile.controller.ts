import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProfileServices } from "./profile.service";
import httpStatus from "http-status";

const getUserProfile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const email = req.user.email;
    const result = await ProfileServices.getUserProfile(email);
    console.log(result);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile retrieved successfully",
        data: result
    })
});



const updateUserProfile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user.id
    const userProfile = req.body;
    const result = await ProfileServices.updateUserProfile(userId, userProfile);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile updated successfully",
        data: result
    })
});



export const ProfileControllers = {
    getUserProfile,
    updateUserProfile
}