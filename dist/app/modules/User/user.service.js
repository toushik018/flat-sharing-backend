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
exports.UserServices = exports.updateUserStatus = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../helpers/paginationHelper");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, profilePhoto, contactNumber } = payload;
    const hashPassword = yield bcrypt_1.default.hash(password, 12);
    const userData = {
        username,
        email,
        password: hashPassword,
        profilePhoto,
        contactNumber,
    };
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const createdUserData = yield transactionClient.user.create({
            data: userData,
        });
        const { password } = createdUserData, user = __rest(createdUserData, ["password"]);
        return user;
    }));
    return result;
});
const createAdmin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(data.password, 12);
    const userData = {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: client_1.UserRole.ADMIN,
        profilePhoto: data.profilePhoto
    };
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.user.create({
            data: userData
        });
        const createdAdminData = yield transactionClient.admin.create({
            data: {
                username: data.username,
                email: data.email,
                role: client_1.UserRole.ADMIN,
                profilePhoto: data.profilePhoto
            }
        });
        return createdAdminData;
    }));
    return result;
});
const getAllUsers = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, username, email, role, status } = params, filterData = __rest(params, ["searchTerm", "username", "email", "role", "status"]);
    const andCondition = [];
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
                equals: status
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
    const result = yield prisma_1.default.user.findMany({
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
    const total = yield prisma_1.default.user.count({
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
const updateUserRole = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, newRole } = payload;
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!existingUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const updatedUser = yield prisma_1.default.user.update({
        where: { id: userId },
        data: { role: newRole },
    });
    return updatedUser;
});
const updateUserStatus = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, status } = payload;
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!existingUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const updatedUser = yield prisma_1.default.user.update({
        where: { id: userId },
        data: { isActive: status },
    });
    return updatedUser;
});
exports.updateUserStatus = updateUserStatus;
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(userId);
    return yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = yield transactionClient.user.findUnique({
            where: { id: userId },
        });
        if (!existingUser) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        // Delete flatShareRequests related to the flats posted by the user
        const userFlats = yield transactionClient.flat.findMany({
            where: { postedBy: userId },
        });
        const flatIds = userFlats.map(flat => flat.id);
        if (flatIds.length > 0) {
            yield transactionClient.flatShareRequest.deleteMany({
                where: { flatId: { in: flatIds } },
            });
        }
        // Delete user's flatShareRequests
        yield transactionClient.flatShareRequest.deleteMany({
            where: { userId: userId },
        });
        // Delete related flats
        yield transactionClient.flat.deleteMany({
            where: { postedBy: userId },
        });
        // Delete the user
        yield transactionClient.user.delete({
            where: { id: userId },
        });
        return { id: userId };
    }));
});
exports.UserServices = {
    createUser,
    createAdmin,
    getAllUsers,
    updateUserRole,
    updateUserStatus: exports.updateUserStatus,
    deleteUser
};
