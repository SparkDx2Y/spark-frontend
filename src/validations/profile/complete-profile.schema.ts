import { z } from "zod";

export const completeProfileSchema = z.object({
    age: z.coerce.number({ 
        invalid_type_error: "Age is required", 
        required_error: "Age is required" 
    })
    .int("Age must be a whole number")
    .min(18, "Age must be at least 18")
    .max(100, "Age cannot be more than 100"),
    gender: z.string().min(1, "Please select your gender"),
    interestedIn: z.string().min(1, "Please select a preference"),
    profilePhoto: z.string().min(1, "Please upload a profile photo"),
    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
});

export type CompleteProfileSchemaType = z.infer<typeof completeProfileSchema>;
