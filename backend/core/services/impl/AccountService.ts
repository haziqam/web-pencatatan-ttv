import { Express, NextFunction, Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { ICache } from "../../../caches/ICache";
import { IUserRepository } from "../../repositories/IUserRepository";
import { IService } from "../IService";
import {
    LoginPayload,
    RegisterPayload,
    loginSchema,
    registerSchema,
} from "../schema/authSchema";
import { UserIdentifier } from "../schema/UserIdentifier";
import { auth } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import { MongoServerError } from "mongodb";
import { RequestWithIdentifier } from "../middlewares/RequestWithIdentifier";

export class AccountService implements IService {
    private router: Router;
    private saltRounds: number;
    private jwtSecret: string;

    constructor(
        private app: Express,
        private userRepository: IUserRepository,
        private cache: ICache
    ) {
        dotenv.config();
        this.router = Router({ mergeParams: true });
        this.saltRounds = parseInt(process.env.SALT_ROUNDS!, 10);
        this.jwtSecret = process.env.JWT_SECRET_KEY!;
    }

    async register(req: Request<{}, {}, RegisterPayload>, res: Response) {
        try {
            const { email, password, firstName, lastName, dateOfBirth, sex } =
                req.body;

            const hashedPassword = await bcrypt.hash(password, this.saltRounds);
            const user = await this.userRepository.create(
                email,
                hashedPassword,
                firstName,
                lastName,
                new Date(dateOfBirth),
                sex
            );

            res.status(201).json({
                message: "User created successfully",
                data: user.publicDataAsJson(),
            });
        } catch (error) {
            if (error instanceof MongoServerError && error.code === 11000) {
                return res.status(400).json({
                    message: "User with this email already exists",
                });
            }
            res.status(500).json({
                message: "Internal server error",
                errors: (error as Error).message,
            });
        }
    }

    async cacheLogin(
        req: Request<{}, {}, LoginPayload>,
        res: Response,
        next: NextFunction
    ) {
        const { email, password } = req.body;
        try {
            const cachedUser = await this.cache.get(`/users/email/${email}`);
            if (!cachedUser) {
                return next();
            }

            const user = JSON.parse(cachedUser);
            const isPasswordValid = await bcrypt.compare(
                password,
                user.hashedPassword
            );

            if (!isPasswordValid) {
                return res.status(400).json({
                    message: "Invalid request",
                    errors: "Invalid email or password",
                });
            }

            this.setJwtCookie(user, res);

            res.status(200).json({
                message: "User logged in successfully",
                data: { id: user.id },
            });
        } catch (error) {
            next();
        }
    }

    async login(req: Request<{}, {}, LoginPayload>, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                return res.status(400).json({
                    message: "Invalid request",
                    errors: "Invalid email or password",
                });
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.hashedPassword
            );

            if (!isPasswordValid) {
                return res.status(400).json({
                    message: "Invalid request",
                    errors: "Invalid email or password",
                });
            }

            this.setJwtCookie(user, res);

            this.cache.set(
                `/users/email/${email}`,
                JSON.stringify(user.dataAsJson())
            );

            res.status(200).json({
                message: "User logged in successfully",
                data: { id: user.id },
            });
        } catch (error) {
            res.status(500).json({
                message: "Internal server error",
                errors: (error as Error).message,
            });
        }
    }

    async logout(req: Request, res: Response) {
        this.clearJwtCookie(res);
        res.status(200).json({ message: "Logged out successfully" });
    }

    async delete(req: RequestWithIdentifier, res: Response) {
        try {
            const { id, email } = req.userIdentifier!;

            await Promise.all([
                this.userRepository.delete(id),
                this.cache.delete(`/users/email/${email}`),
            ]);

            this.clearJwtCookie(res);

            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            res.status(403).json({
                message: "Forbidden request",
                errors: (error as Error).message,
            });
        }
    }

    private setJwtCookie(user: UserIdentifier, res: Response) {
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            this.jwtSecret,
            {
                expiresIn: "1h",
            }
        );

        res.cookie("access-token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000,
        });
    }

    private clearJwtCookie(res: Response) {
        res.clearCookie("access-token");
    }

    registerRoutes(): void {
        this.router.post(
            "/register",
            validateRequest(registerSchema),
            this.register.bind(this)
        );
        this.router.post(
            "/login",
            validateRequest(loginSchema),
            this.cacheLogin.bind(this),
            this.login.bind(this)
        );
        this.router.post("/logout", this.logout.bind(this));
        this.router.delete("/delete", auth, this.delete.bind(this));

        this.app.use("/users/auth", this.router);
    }
}
