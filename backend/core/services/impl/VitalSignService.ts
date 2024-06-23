import { ICache } from "../../../caches/ICache";
import { IVitalSignRepository } from "../../repositories/IVitalSignRepository";
import { IService } from "../IService";
import { Express, NextFunction, Request, Response, Router } from "express";

export class VitalSignService implements IService {
    private router: Router;

    constructor(
        private app: Express,
        private vitalSignRepository: IVitalSignRepository,
        private cache: ICache
    ) {
        this.router = Router({ mergeParams: true });
    }

    async cacheGetAll(
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const cachedVitalSigns = await this.cache.get(
                `/users/${id}/vital-signs`
            );
            if (!cachedVitalSigns) {
                return next();
            }

            res.status(200).json({
                message: "Success",
                data: JSON.parse(cachedVitalSigns),
            });
        } catch (error) {
            next();
        }
    }

    async getAll(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            const vitalSigns = await this.vitalSignRepository.getAll(id);
            const vitalSignsJson = vitalSigns.map((v) => v.dataAsJson());
            res.status(200).json({
                message: "Success",
                data: vitalSignsJson,
            });

            this.cache.set(
                `/users/${id}/vital-signs`,
                JSON.stringify(vitalSignsJson)
            );
        } catch (error) {
            res.status(500).json({
                message: "Internal server error",
                errors: (error as Error).message,
            });
        }
    }

    registerRoutes(): void {
        this.router.get(
            "/",
            this.cacheGetAll.bind(this),
            this.getAll.bind(this)
        );

        this.app.use("/users/:id/vital-signs", this.router);
    }
}
