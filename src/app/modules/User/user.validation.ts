import { z } from "zod";

const createUserSchema = z.object({
    username: z.string(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
});


const createAdminSchema = z.object({
    username: z.string(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    profilePhoto: z.string().optional(),
});

export const userValidationSchema = {
    createUserSchema,
    createAdminSchema
};
