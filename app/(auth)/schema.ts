import { z } from "zod";

export const signInSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(
            /^(?=.*[a-zA-Z])(?=.*[09])(?=.*[!@#$%^&*])/,
            "Password must contain at least one letter, one number, and one special character"
        )
        .regex(
            /^(?=.*[a-z])/,
            "Password must contain at least one lowercase letter"
        )
        .regex(
            /^(?=.*[A-Z])/,
            "Password must contain at least one uppercase letter"
        ),
    remember: z.boolean().default(true).optional()
});

export const registerSchema = z.object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(
            /^(?=.*[a-zA-Z])(?=.*[09])(?=.*[!@#$%^&*])/,
            "Password must contain at least one letter, one number, and one special character"
        )
        .regex(
            /^(?=.*[a-z])/,
            "Password must contain at least one lowercase letter"
        )
        .regex(
            /^(?=.*[A-Z])/,
            "Password must contain at least one uppercase letter"
        )
    
})