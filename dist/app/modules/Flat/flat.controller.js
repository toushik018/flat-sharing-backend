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
exports.FlatControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const flat_service_1 = require("./flat.service");
const pick_1 = __importDefault(require("../../utils/pick"));
const flat_constants_1 = require("./flat.constants");
const addFlatIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const flatData = req.body;
    const result = yield flat_service_1.FlatServices.postFlatIntoDB(userId, flatData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Flat added successfully",
        data: result
    });
}));
const getAllFlats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, flat_constants_1.flatFilterableFields);
    const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = yield flat_service_1.FlatServices.getAllFlats(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Flats fetched successfully",
        meta: result.meta,
        data: result.data
    });
}));
;
const getFlatPostById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const flatPost = yield flat_service_1.FlatServices.getFlatPostById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Flat post retrieved successfully',
        data: flatPost,
    });
}));
const updateFlat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { flatId } = req.params;
    const result = yield flat_service_1.FlatServices.updateFlat(flatId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Flat updated successfully",
        data: result
    });
}));
const getUserFlats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const flats = yield flat_service_1.FlatServices.getMyFlats(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User flats retrieved successfully",
        data: flats,
    });
}));
const deleteFlat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const role = req.user.role;
    const { flatId } = req.params;
    const result = yield flat_service_1.FlatServices.deleteFlat(userId, role, flatId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Flat deleted successfully",
        data: result
    });
}));
exports.FlatControllers = {
    addFlatIntoDB,
    getAllFlats,
    updateFlat,
    deleteFlat,
    getFlatPostById,
    getUserFlats
};
