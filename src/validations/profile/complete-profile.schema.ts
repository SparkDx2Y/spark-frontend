import { z } from "zod";

export const completeProfileSchema = z.object({
    age: z.number().int().min(18, "Age must be at least 18"),
    gender: z.enum(["male", "female"] as const),
    interestedIn: z.enum(["male", "female"] as const),
    profilePhoto: z.string().min(1, "Please upload a profile photo"),
});

export type CompleteProfileSchemaType = z.infer<typeof completeProfileSchema>;
