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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlatShareRequestService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const submitFlatShareRequest = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    const existingFlat = yield prisma_1.default.flat.findUnique({
        where: { id: payload.flatId },
    });
    if (!existingUser || !existingFlat) {
        throw new AppError_1.default(404, 'User or flat not found');
    }
    // Store the flat share request in the database
    const newFlatShareRequest = yield prisma_1.default.flatShareRequest.create({
        data: {
            userId,
            flatId: payload.flatId,
            moveInDate: payload.moveInDate,
            lengthOfStay: payload.lengthOfStay,
            status: client_1.RequestStatus.PENDING,
        },
    });
    return newFlatShareRequest;
});
const getUserFlatShareRequests = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const flatShareRequests = yield prisma_1.default.flatShareRequest.findMany({
        where: {
            userId: userId
        },
        include: {
            flat: true
        }
    });
    if (!flatShareRequests) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No flat share requests found for this user');
    }
    return flatShareRequests;
});
const updateFlatShareRequestStatus = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId, status, userId } = data;
    // Validate request existence
    const flatShareRequest = yield prisma_1.default.flatShareRequest.findUnique({
        where: { id: requestId },
        include: { flat: true },
    });
    if (!flatShareRequest) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Flat share request not found');
    }
    // Check if the userId matches the flat's postedBy field
    if (flatShareRequest.flat.postedBy !== userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not allowed to approve or reject this request');
    }
    // Update the status of the flat share request
    const updatedFlatShareRequest = yield prisma_1.default.flatShareRequest.update({
        where: { id: requestId },
        data: { status },
        include: { user: true, flat: true },
    });
    return updatedFlatShareRequest;
});
const getRequestsForFlat = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const flats = yield prisma_1.default.flat.findMany({
        where: { postedBy: userId },
        include: {
            requests: {
                include: {
                    user: true,
                },
            },
        },
    });
    if (!flats) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No flats found for this user');
    }
    return flats;
});
exports.FlatShareRequestService = {
    submitFlatShareRequest,
    getUserFlatShareRequests,
    updateFlatShareRequestStatus,
    getRequestsForFlat
};
