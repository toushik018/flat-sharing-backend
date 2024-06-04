"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get('/users', (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.userControllers.getAllUsers);
router.patch('/update-role', (0, auth_1.default)('ADMIN'), user_controller_1.userControllers.updateUserRole);
router.patch('/update-status', (0, auth_1.default)('ADMIN'), user_controller_1.userControllers.updateUserStatus);
router.post('/register', (0, validateRequest_1.default)(user_validation_1.userValidationSchema.createUserSchema), user_controller_1.userControllers.createUser);
router.post('/admin-register', 
// validateRequest(userValidationSchema.createAdminSchema),
user_controller_1.userControllers.createAdmin);
router.delete('/delete/:userId', (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.userControllers.deleteUser);
exports.userRoutes = router;
