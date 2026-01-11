import { z } from "zod";

export const otpSchema = z.object({

    otp: z
    .string()
    .regex(/^\d{6}$/, { message: "OTP must be 6 digits and only contain numbers" }),

})

export type OtpSchemaType = z.infer<typeof otpSchema>;