import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(0),
  dateOfBirth: z.string().date(),
  sex: z.enum(["MALE", "FEMALE"]),
});

export type RegisterRequest = z.infer<typeof registerSchema>;

export type RegisterResponse = {
  message: string;
  errors?: string;
  data?: {
    id: string;
  };
};

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must at least have 8 characters" }),
});

export type LoginRequest = z.infer<typeof loginSchema>;

export type LoginResponse = RegisterResponse;
