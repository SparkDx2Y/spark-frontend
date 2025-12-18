import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z.string().min(6, { message: "Password is required" }).trim(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
