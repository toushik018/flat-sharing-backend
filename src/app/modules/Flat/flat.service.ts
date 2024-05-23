import { BookingStatus, Flat, Prisma, User, UserProfile } from "@prisma/client";
import prisma from "../../utils/prisma";
import { flatSearchableFields } from "./flat.constants";
import { FlatInput } from "./flat.interface";
import { TPaginationOptions } from "../../interface/pagination";
import { paginationHelper } from "../../helpers/paginationHelper";

const addFlatIntoDB = async (payload: any) => {

    const flatData = await prisma.flat.create({ data: payload });
    return flatData;
}




const getAllFlats = async (params: FlatInput, options: TPaginationOptions) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, availability, ...filterdata } = params;
    const andCondition: Prisma.FlatWhereInput[] = [];

    if (params.searchTerm) {
        andCondition.push({
            OR: flatSearchableFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive"
                }
            }))
        });
    }


    const availabilityValue = typeof availability === 'string' ? availability === 'true' : availability;
    if (availabilityValue !== undefined && availabilityValue !== null) {
        andCondition.push({
            availability: availabilityValue
        });
    }


    if (Object.keys(filterdata).length > 0) {
        andCondition.push({
            AND: Object.keys(filterdata).map(key => ({
                [key]: {
                    equals: (filterdata as any)[key]
                }
            }))
        });
    }

    const whereCondition: Prisma.FlatWhereInput = {
        AND: andCondition
    };



    const result = await prisma.flat.findMany({
        where: whereCondition,
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



export const FlatServices = {
    addFlatIntoDB,
    getAllFlats,
    updateFlat,
}