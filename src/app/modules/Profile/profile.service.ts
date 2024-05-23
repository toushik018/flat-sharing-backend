import { UserProfile } from "@prisma/client";
import prisma from "../../utils/prisma";

const getUserProfile = async (userId: string) => {

    const userProfile = await prisma.userProfile.findUnique({
        where: {
            userId
        }
    });

    return userProfile;
};



const updateUserProfile = async (userId: string, userProfileData: UserProfile): Promise<UserProfile> => {

    const existingUserProfile = await prisma.userProfile.findUniqueOrThrow({
        where: {
            userId
        }
    });

    const updatedUserProfile = await prisma.userProfile.update({
        where: {
            userId
        },
        data: {
            ...userProfileData
        }
    });

    return updatedUserProfile;
};

export const ProfileServices = {
    getUserProfile,
    updateUserProfile
}