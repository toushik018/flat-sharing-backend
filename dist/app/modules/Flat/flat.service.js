"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlatServices = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const paginationHelper_1 = require("../../helpers/paginationHelper");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const postFlatIntoDB = (userId, flatData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user is active
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!existingUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (existingUser.isActive !== 'ACTIVATE') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Deactivated users cannot post a flat");
    }
    const newFlat = yield prisma_1.default.flat.create({
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
});
const getAllFlats = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, location, minPrice, maxPrice, bedrooms } = params, filterData = __rest(params, ["searchTerm", "location", "minPrice", "maxPrice", "bedrooms"]);
    const andCondition = [];
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
        const priceCondition = {};
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
        const bedroom = Number(bedrooms);
        andCondition.push({
            bedrooms: {
                equals: bedroom
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
    const whereCondition = {
        AND: andCondition
    };
    const result = yield prisma_1.default.flat.findMany({
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
    const total = yield prisma_1.default.flat.count({
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
});
const updateFlat = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.flat.findUniqueOrThrow({
        where: {
            id
        }
    });
    const result = yield prisma_1.default.flat.update({
        where: {
            id
        },
        data
    });
    return result;
});
const getFlatPostById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const flatPost = yield prisma_1.default.flat.findUnique({
        where: { id },
        include: {
            user: true,
            requests: true,
        },
    });
    if (!flatPost) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Flat post not found');
    }
    return flatPost;
});
const getMyFlats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userFlats = yield prisma_1.default.flat.findMany({
        where: {
            postedBy: userId,
        },
    });
    if (!userFlats) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No flats found for this user");
    }
    return userFlats;
});
const deleteFlat = (userId, userRole, flatId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const existingFlat = yield transactionClient.flat.findUnique({
            where: {
                id: flatId
            }
        });
        if (!existingFlat) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Flat not found");
        }
        // Check if the user is the owner of the flat
        if (existingFlat.postedBy !== userId && userRole !== 'ADMIN') {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to delete this flat");
        }
        // Delete related flat share requests
        yield transactionClient.flatShareRequest.deleteMany({
            where: { flatId: flatId },
        });
        // Delete the flat
        const deletedFlat = yield transactionClient.flat.delete({
            where: {
                id: flatId
            }
        });
        return deletedFlat;
    }));
});
exports.FlatServices = {
    postFlatIntoDB,
    getAllFlats,
    updateFlat,
    getFlatPostById,
    deleteFlat,
    getMyFlats
};
