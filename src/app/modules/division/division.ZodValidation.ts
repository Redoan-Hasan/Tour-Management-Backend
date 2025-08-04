import z from "zod";

export const createDivisionZodSchema = z.object({
    name: z
    .string({ invalid_type_error: "Division Name must be string" })
    .min(2, { message: "Division Name must be at least 2 characters long." })
    .max(20, { message: " Division Name cannot exceed 20 characters." }),
    thumbnail: z
    .string({ invalid_type_error: "Thumbnail must be string" })
    .optional(),
    description: z
    .string({invalid_type_error: "Description must be string"})
    .optional()
})

export const updateDivisionZodSchema = z.object({
    name: z
    .string({ invalid_type_error: "Division Name must be string" })
    .min(2, { message: "Division Name must be at least 2 characters long." })
    .max(20, { message: "Division Name cannot exceed 20 characters." })
    .optional(),
    thumbnail: z
    .string({ invalid_type_error: "Thumbnail must be string" })
    .optional(),
    description: z
    .string({invalid_type_error: "Description must be string"})
    .optional()
})