import { z } from "zod";
import { Sex } from "../../entities/User";

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(0),
    dateOfBirth: z.string().date(),
    sex: z.nativeEnum(Sex),
});

export type RegisterPayload = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type LoginPayload = z.infer<typeof loginSchema>;
