"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatRoutes = void 0;
const express_1 = __importDefault(require("express"));
const flat_controller_1 = require("./flat.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get('/flats', 
// auth(UserRole.ADMIN), 
flat_controller_1.FlatControllers.getAllFlats);
router.get('/flat/:id', flat_controller_1.FlatControllers.getFlatPostById);
router.get('/my-flats', (0, auth_1.default)(), flat_controller_1.FlatControllers.getUserFlats);
router.put('/flats/:flatId', (0, auth_1.default)(), flat_controller_1.FlatControllers.updateFlat);
router.post('/flats', (0, auth_1.default)(), flat_controller_1.FlatControllers.addFlatIntoDB);
router.delete('/flats/:flatId', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), flat_controller_1.FlatControllers.deleteFlat);
exports.flatRoutes = router;
