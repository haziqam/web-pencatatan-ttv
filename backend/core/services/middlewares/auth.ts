import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserIdentifier } from "../schema/UserIdentifier";
import { RequestWithIdentifier } from "./RequestWithIdentifier";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET_KEY!;
export function auth(
    req: RequestWithIdentifier,
    res: Response,
    next: NextFunction
) {
    try {
        const token = req.cookies["access-token"];
        const decodedToken = jwt.verify(token, jwtSecret) as UserIdentifier;
        const userIdParam = req.params["id"];
        if (userIdParam && userIdParam != decodedToken.id) {
            return res.status(401).json({
                message: "Not authorized to access this resource.",
            });
        }

        req.userIdentifier = decodedToken;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(403).json({
                message: "Your session has expired. Please log in again.",
                expiredAt: error.expiredAt,
            });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({
                message: "Invalid token. Please log in again.",
            });
        } else {
            return res.status(500).json({
                message:
                    "An unexpected error occurred. Please try again later.",
                errors: (error as Error).message,
            });
        }
    }
}
