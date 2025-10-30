import { z } from 'zod';
export const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long').optional(),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters long').optional(),
    image: z.instanceof(File).refine(
        (file) => file.size < 2000000, // 1MB size limit (1,000,000 bytes)
        'Image must be less than 2MB.'
    )
        .refine(
            (file) =>
                ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(
                    file.type
                ),
            'Only .jpg, .png, .webp, or .svg formats are supported.'
        ).optional()
});