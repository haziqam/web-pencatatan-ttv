import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";

export function validateRequest(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (e) {
            if (e instanceof ZodError) {
                return res.status(400).json({
                    message: "Invalid request",
                    errors: e.errors,
                });
            }
        }
    };
}
