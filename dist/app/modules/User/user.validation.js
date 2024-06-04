"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidationSchema = void 0;
const zod_1 = require("zod");
const createUserSchema = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
    profilePhoto: zod_1.z.string().optional(),
    contactNumber: zod_1.z.string().optional(),
});
const createAdminSchema = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
    profilePhoto: zod_1.z.string().optional(),
});
exports.userValidationSchema = {
    createUserSchema,
    createAdminSchema
};
