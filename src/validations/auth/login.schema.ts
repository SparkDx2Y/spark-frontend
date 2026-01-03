import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z.string().min(6, { message: "Password is required" }).trim(),
    role: z.enum(['admin', 'user'], { message: 'Invalid role' }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
