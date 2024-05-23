import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.createUser(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User registered successfully",
        data: result,
    });
});


const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.createAdmin(req.body);
    console.log(result, "constructing admin");
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Admin created successfully",
        data: null,
    });
});

export const userControllers = {
    createUser,
    createAdmin
}