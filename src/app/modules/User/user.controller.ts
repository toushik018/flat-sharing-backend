import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import httpStatus from "http-status";
import pick from "../../utils/pick";
import { userFilterableFields } from "./user.constant";
import { UserRole, UserStatus } from "@prisma/client";
import AppError from "../../errors/AppError";

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
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Admin created successfully",
        data: result,
    });
});



const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await UserServices.getAllUsers(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
})



const updateUserRole = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { userId, newRole } = req.body;

    if (req.user.role !== UserRole.ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to update user roles');
    }

    const updatedUser = await UserServices.updateUserRole({ userId, newRole: newRole as UserRole });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User role updated successfully',
        data: updatedUser,
    });
});



const updateUserStatus = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { userId, status } = req.body;

    if (req.user.role !== 'ADMIN') {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to update user status');
    }

    if (!Object.values(UserStatus).includes(status)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid status value');
    }

    const updatedUser = await UserServices.updateUserStatus({ userId, status: status as UserStatus });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User status updated successfully',
        data: updatedUser,
    });
});


const deleteUser = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { userId } = req.params;
    const result = await UserServices.deleteUser(userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User deleted successfully",
        data: result,
    });
});



export const userControllers = {
    createUser,
    createAdmin,
    getAllUsers,
    updateUserRole,
    updateUserStatus,
    deleteUser
}