import { User } from "@prisma/client";
import prisma from "../../utils/prisma";

const getUserProfile = async (email: string) => {

    const userProfile = await prisma.user.findUnique({
        where: {
            email
        }
    });

    return userProfile;
};



const updateUserProfile = async (userId: string, userData: Partial<User>): Promise<User> => {

    const existingUserProfile = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    });

    const updatedUserProfile = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            ...userData
        }
    });

    return updatedUserProfile;
};


export const ProfileServices = {
    getUserProfile,
    updateUserProfile
}