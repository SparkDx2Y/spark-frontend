import { z } from "zod";

export const planSchema = z.object({
    name: z.string().trim().min(2, "Plan name must be at least 2 characters")
        .max(30, "Plan name must be less than 30 characters")
        .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed")
        .toUpperCase(),

    price: z.coerce.number().min(0, "Price must be at least 0").max(20000, "Price cannot exceed 20,000"),

    durationValue: z.coerce.number().min(1, "Duration must be at least 1"),

    durationUnit: z.enum(['month', 'year']),

    features: z.object({
        seeWhoLikedYou: z.boolean(),
        seeWhoViewedProfile: z.boolean(),
        chatEnabled: z.boolean(),
        dailyMessageLimit: z.coerce.number().min(-1, "Use -1 for unlimited"),
        mediaSharingEnabled: z.boolean(),
        audioEnabled: z.boolean(),
        videoCallEnabled: z.boolean(),
        swipeLimit: z.coerce.number().min(-1, "Use -1 for unlimited"),
    }).refine((f) => {
        const hasActiveToggle = f.seeWhoLikedYou || f.seeWhoViewedProfile || f.chatEnabled || f.mediaSharingEnabled || f.audioEnabled || f.videoCallEnabled;
        const hasNonZeroLimit = f.dailyMessageLimit !== 0 || f.swipeLimit !== 0;
        return hasActiveToggle || hasNonZeroLimit;
    }, {
        message: "Please select at least one feature or provide a limit"
    }),
    isActive: z.boolean(),
}).refine((data) => {
    if (data.price === 0) return true;
    if (data.durationUnit === 'month') return data.durationValue <= 12;
    if (data.durationUnit === 'year') return data.durationValue <= 10;
    return true;
}, {
    message: "Max 12 months or 10 years allowed",
    path: ["durationValue"]
});

export type PlanFormData = z.infer<typeof planSchema>;
