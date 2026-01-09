import { z } from 'zod';
export const createProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().min(1, "Description is required"),
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
});
