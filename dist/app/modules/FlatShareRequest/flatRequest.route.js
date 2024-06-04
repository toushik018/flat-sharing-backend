"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const auth_1 = __importDefault(require("../../middleware/auth"));
const express_1 = __importDefault(require("express"));
const flatRequest_controller_1 = require("./flatRequest.controller");
const router = express_1.default.Router();
router.get('/flat-requests', (0, auth_1.default)(), flatRequest_controller_1.FlatShareRequestControllers.getUserFlatShareRequests);
router.get('/flats-with-requests', (0, auth_1.default)(), flatRequest_controller_1.FlatShareRequestControllers.getRequestsForFlat);
router.post('/flat-request', (0, auth_1.default)(), flatRequest_controller_1.FlatShareRequestControllers.submitFlatRequest);
router.patch('/flat-request/status', (0, auth_1.default)(), flatRequest_controller_1.FlatShareRequestControllers.updateFlatShareRequestStatus);
exports.bookingRoutes = router;
