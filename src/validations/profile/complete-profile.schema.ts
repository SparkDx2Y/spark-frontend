import { z } from "zod";

export const completeProfileSchema = z.object({
    age: z.number().int().min(18, "Age must be at least 18"),
    gender: z.enum(["male", "female"] as const),
    interestedIn: z.enum(["male", "female"] as const),
    photos: z.array(z.string()).min(2, "Please upload at least 2 photos").max(6, "Please upload at most 6 photos"),
});

export type CompleteProfileSchemaType = z.infer<typeof completeProfileSchema>;
