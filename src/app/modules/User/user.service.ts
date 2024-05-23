import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import { UserRole } from "@prisma/client";

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
        role: UserRole.ADMIN
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


export const UserServices = {
    createUser,
    createAdmin
};
