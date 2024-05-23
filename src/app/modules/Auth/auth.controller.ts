import { Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { AuthServices } from "./auth.service"
import httpStatus from "http-status"




const loginUser = catchAsync(async (req: Request, res: Response) => {

    const result = await AuthServices.loginUser(req.body);

    const { refreshToken, ...data } = result;

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false
    })
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: data
    })
})

const changePassword = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await AuthServices.changePassword(user, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password changed successfully",
        data: result
    })
})


export const AuthControllers = {
    loginUser,
    changePassword
}