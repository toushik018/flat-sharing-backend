import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import { Prisma, UserRole, UserStatus } from "@prisma/client";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TPaginationOptions } from "../../interface/pagination";
import { IUpdateUserRole, IUpdateUserStatus, UserInput } from "./user.constant";
import { paginationHelper } from "../../helpers/paginationHelper";

type UserCreateInput = {
    username: string;
    email: string;
    password: string;
    profilePhoto?: string;
    contactNumber?: string;
};

interface AdminCreateInput {
    username: string;
    email: string;
    password: string;
    profilePhoto?: string;
}


const createUser = async (payload: UserCreateInput) => {
    const { username, email, password, profilePhoto, contactNumber } = payload;

    const hashPassword: string = await bcrypt.hash(password, 12);

    const userData = {
        username,
        email,
        password: hashPassword,
        profilePhoto,
        contactNumber,
    };

    const result = await prisma.$transaction(async (transactionClient) => {
        const createdUserData = await transactionClient.user.create({
            data: userData,
        });

        const { password, ...user } = createdUserData;
        return user;
    });

    return result;
};


const createAdmin = async (data: AdminCreateInput) => {
    const hashedPassword: string = await bcrypt.hash(data.password, 12);

    const userData = {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
        profilePhoto: data.profilePhoto
    };


    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });


        const createdAdminData = await transactionClient.admin.create({
            data: {
                username: data.username,
                email: data.email,
                role: UserRole.ADMIN,
                profilePhoto: data.profilePhoto
            }
        });
        return createdAdminData;
    });

    return result;
};

const getAllUsers = async (params: UserInput, options: TPaginationOptions) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, username, email, role, status, ...filterData } = params;
    const andCondition: Prisma.UserWhereInput[] = [];

    if (searchTerm) {
        andCondition.push({
            OR: ["username", "email"].map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        });
    }

    if (username) {
        andCondition.push({
            username: {
                contains: username,
                mode: "insensitive"
            }
        });
    }

    if (email) {
        andCondition.push({
            email: {
                contains: email,
                mode: "insensitive"
            }
        });
    }



    if (status) {
        andCondition.push({
            isActive: {
                equals: status as UserStatus
            }
        });
    }

    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as Record<string, unknown>)[key]
                }
            }))
        });
    }

    const whereCondition: Prisma.UserWhereInput = {
        AND: andCondition
    };

    const result = await prisma.user.findMany({
        where: whereCondition,
        include: {
            flats: true,
            requests: true
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: "desc"
        }
    });

    const total = await prisma.user.count({
        where: whereCondition
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
};



const updateUserRole = async (payload: IUpdateUserRole) => {
    const { userId, newRole } = payload;

    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!existingUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
    });

    return updatedUser;
};




export const updateUserStatus = async (payload: IUpdateUserStatus) => {
    const { userId, status } = payload;

    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!existingUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isActive: status },
    });

    return updatedUser;
};


const deleteUser = async (userId: string) => {
    console.log(userId);
    return await prisma.$transaction(async (transactionClient) => {
        const existingUser = await transactionClient.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            throw new AppError(httpStatus.NOT_FOUND, 'User not found');
        }

        // Delete flatShareRequests related to the flats posted by the user
        const userFlats = await transactionClient.flat.findMany({
            where: { postedBy: userId },
        });

        const flatIds = userFlats.map(flat => flat.id);

        if (flatIds.length > 0) {
            await transactionClient.flatShareRequest.deleteMany({
                where: { flatId: { in: flatIds } },
            });
        }

        // Delete user's flatShareRequests
        await transactionClient.flatShareRequest.deleteMany({
            where: { userId: userId },
        });

        // Delete related flats
        await transactionClient.flat.deleteMany({
            where: { postedBy: userId },
        });

        // Delete the user
        await transactionClient.user.delete({
            where: { id: userId },
        });

        return { id: userId };
    });
};



export const UserServices = {
    createUser,
    createAdmin,
    getAllUsers,
    updateUserRole,
    updateUserStatus,
    deleteUser
}
