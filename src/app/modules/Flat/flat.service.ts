import { Flat, Prisma, User } from "@prisma/client";
import prisma from "../../utils/prisma";
import { flatSearchableFields } from "./flat.constants";
import { FlatInput } from "./flat.interface";
import { TPaginationOptions } from "../../interface/pagination";
import { paginationHelper } from "../../helpers/paginationHelper";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const postFlatIntoDB = async (userId: any, flatData: Flat) => {
    // Check if the user is active
    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!existingUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (existingUser.isActive !== 'ACTIVATE') {
        throw new AppError(httpStatus.FORBIDDEN, "Deactivated users cannot post a flat");
    }

    const newFlat = await prisma.flat.create({
        data: {
            location: flatData.location,
            description: flatData.description,
            rentAmount: flatData.rentAmount,
            bedrooms: flatData.bedrooms,
            amenities: flatData.amenities,
            photos: flatData.photos,
            postedBy: userId,
        },
    });

    return newFlat;
}




const getAllFlats = async (params: FlatInput, options: TPaginationOptions) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, location, minPrice, maxPrice, bedrooms, ...filterData } = params;
    const andCondition: Prisma.FlatWhereInput[] = [];


    if (searchTerm) {
        andCondition.push({
            OR: ["location", "description"].map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        });
    }

    if (location) {
        andCondition.push({
            location: {
                contains: location,
                mode: "insensitive"
            }
        });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        const priceCondition: Prisma.FloatFilter = {};
        if (minPrice !== undefined) {
            priceCondition.gte = Number(minPrice);
        }
        if (maxPrice !== undefined) {
            priceCondition.lte = Number(maxPrice);
        }
        andCondition.push({
            rentAmount: priceCondition
        });
    }

    if (bedrooms) {
        andCondition.push({
            bedrooms: {
                equals: bedrooms
            }
        });
    }

    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }

    const whereCondition: Prisma.FlatWhereInput = {
        AND: andCondition
    };

    const result = await prisma.flat.findMany({
        where: whereCondition,
        include: {
            user: true
        },

        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: "desc"
        }
    });

    const total = await prisma.flat.count({
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



const updateFlat = async (id: string, data: Partial<Flat>): Promise<Flat> => {

    await prisma.flat.findUniqueOrThrow({
        where: {
            id
        }
    });

    const result = await prisma.flat.update({
        where: {
            id
        },
        data
    })

    return result;
}


const getFlatPostById = async (id: string) => {

    const flatPost = await prisma.flat.findUnique({
        where: { id },
        include: {
            user: true,
            requests: true,
        },
    });

    if (!flatPost) {
        throw new AppError(httpStatus.NOT_FOUND, 'Flat post not found');
    }

    return flatPost;
};


const getMyFlats = async (userId: string): Promise<Flat[]> => {
    const userFlats = await prisma.flat.findMany({
        where: {
            postedBy: userId,
        },
    });

    if (!userFlats) {
        throw new AppError(httpStatus.NOT_FOUND, "No flats found for this user");
    }

    return userFlats;
};


const deleteFlat = async (userId: string, userRole: string, flatId: string) => {

    const existingFlat = await prisma.flat.findUnique({
        where: {
            id: flatId
        }
    });

    if (!existingFlat) {
        throw new AppError(httpStatus.NOT_FOUND, "Flat not found");
    }

    // Check if the user is the owner of the flat
    if (existingFlat.postedBy !== userId && userRole !== 'ADMIN') {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to delete this flat");
    }
    // Delete the flat
    const deletedFlat = await prisma.flat.delete({
        where: {
            id: flatId
        }
    });

    return deletedFlat;
};


export const FlatServices = {
    postFlatIntoDB,
    getAllFlats,
    updateFlat,
    getFlatPostById,
    deleteFlat,
    getMyFlats
}