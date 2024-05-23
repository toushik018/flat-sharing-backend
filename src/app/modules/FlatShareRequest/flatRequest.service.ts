
import { FlatShareRequest, RequestStatus } from "@prisma/client";
import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TFlatShareRequestStatus } from "./flatRequest.constant";

const submitFlatShareRequest = async (
    payload: any,
    userId: string,
) => {
    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
    });



    const existingFlat = await prisma.flat.findUnique({
        where: { id: payload.flatId },
    });

    console.log(existingFlat);
    if (!existingUser || !existingFlat) {
        throw new AppError(404, 'User or flat not found');
    }

    // Store the flat share request in the database
    const newFlatShareRequest = await prisma.flatShareRequest.create({
        data: {
            userId,
            flatId: payload.flatId,
            moveInDate: payload.moveInDate,
            lengthOfStay: payload.lengthOfStay,
            status: RequestStatus.PENDING, // or any other default status
        },
    });

    return newFlatShareRequest;

};


const getUserFlatShareRequests = async (userId: string) => {

    const flatShareRequests = await prisma.flatShareRequest.findMany({
        where: {
            userId: userId
        },
        include: {
            flat: true
        }
    });

    if (!flatShareRequests) {
        throw new AppError(httpStatus.NOT_FOUND, 'No flat share requests found for this user');
    }

    return flatShareRequests;
};


const updateFlatShareRequestStatus = async (data: TFlatShareRequestStatus) => {
    const { requestId, status, userId } = data;
    console.log(userId);
    // Validate request existence
    const flatShareRequest = await prisma.flatShareRequest.findUnique({
        where: { id: requestId },
        include: {
            flat: true,
        }
    });

    if (!flatShareRequest) {
        throw new AppError(httpStatus.NOT_FOUND, 'Flat share request not found');
    }


    // Check if the userId matches the flat's postedBy field
    if (flatShareRequest.flat.postedBy !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not allowed to approve or reject this request');
    }

    // Update the status of the flat share request
    const updatedFlatShareRequest = await prisma.flatShareRequest.update({
        where: { id: requestId },
        data: { status },
        include: {
            user: true,
            flat: true,
        }
    });

    return updatedFlatShareRequest;
}








export const FlatShareRequestService = {
    submitFlatShareRequest,
    getUserFlatShareRequests,
    updateFlatShareRequestStatus
}