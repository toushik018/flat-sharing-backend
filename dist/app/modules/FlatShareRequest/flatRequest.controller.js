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
exports.FlatShareRequestControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const flatRequest_service_1 = require("./flatRequest.service");
const http_status_1 = __importDefault(require("http-status"));
const submitFlatRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield flatRequest_service_1.FlatShareRequestService.submitFlatShareRequest(req.body, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Flat share request submitted successfully',
        data: result,
    });
}));
const getUserFlatShareRequests = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield flatRequest_service_1.FlatShareRequestService.getUserFlatShareRequests(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Flat share requests retrieved successfully',
        data: result,
    });
}));
const updateFlatShareRequestStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { requestId, status } = req.body;
    const updatedRequest = yield flatRequest_service_1.FlatShareRequestService.updateFlatShareRequestStatus({ requestId, status, userId });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Flat share request status updated successfully',
        data: updatedRequest,
    });
}));
const getRequestsForFlat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield flatRequest_service_1.FlatShareRequestService.getRequestsForFlat(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Flats with requests retrieved successfully',
        data: result,
    });
}));
exports.FlatShareRequestControllers = {
    submitFlatRequest,
    getUserFlatShareRequests,
    updateFlatShareRequestStatus,
    getRequestsForFlat
};
