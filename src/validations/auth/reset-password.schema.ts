import { z } from "zod";

export const resetPasswordSchema = z.object({


    newPassword: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be less than 20 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,  {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    }),

    confirmPassword: z.string()
})
.refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;