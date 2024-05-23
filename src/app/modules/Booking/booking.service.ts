import { BookingStatus } from "@prisma/client";
import prisma from "../../utils/prisma";

const flatBooking = async (flatId: string, userId: string) => {
    const existingFlat = await prisma.flat.findUniqueOrThrow({
        where: {
            id: flatId
        },

    })


    const booking = await prisma.booking.create({
        data: {
            flatId,
            userId,
            status: BookingStatus.PENDING
        }
    });

    return booking;

}



const getBookingRequests = async () => {
    const bookingRequest = await prisma.booking.findMany();
    return bookingRequest;
}







const updateBookingRequest = async (bookingId: string, status: BookingStatus) => {

    const existingBooking = await prisma.booking.findUniqueOrThrow({
        where: {
            id: bookingId
        }
    });

    const updatedBooking = await prisma.booking.update({
        where: {
            id: bookingId
        },
        data: {
            status
        }
    });

    return updatedBooking;
};


export const BookingServices = {
    flatBooking,
    getBookingRequests,
    updateBookingRequest
}