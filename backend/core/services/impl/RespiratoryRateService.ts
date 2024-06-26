import { ICache } from "../../../caches/ICache";
import { IRespiratoryRateRepository } from "../../repositories/IRespiratoryRateRepository";
import { IService } from "../IService";
import { Express, NextFunction, Request, Response, Router } from "express";
import {
    StoreRespiratoryRatePayload,
    UpdateRespiratoryRatePayload,
} from "../schema/vitalSignSchema";
import { auth } from "../middlewares/auth";

export class RespiratoryRateService implements IService {
    private router: Router;

    constructor(
        private app: Express,
        private respiratoryRateRepository: IRespiratoryRateRepository,
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
            const cachedRespiratoryRates = await this.cache.get(
                `/users/${id}/respiratory-rates`
            );

            if (!cachedRespiratoryRates) {
                return next();
            }

            res.status(200).json({
                message: "Success",
                data: JSON.parse(cachedRespiratoryRates),
            });
        } catch (error) {
            next();
        }
    }

    async getAll(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            const respiratoryRates =
                await this.respiratoryRateRepository.getAll(id);
            const respiratoryRatesJson = respiratoryRates.map((v) =>
                v.dataAsJson()
            );

            res.status(200).json({
                message: "Success",
                data: respiratoryRatesJson,
            });

            this.cache.set(
                `/users/${id}/respiratory-rates`,
                JSON.stringify(respiratoryRatesJson)
            );
        } catch (error) {
            res.status(500).json({
                message: "Internal server error",
                errors: (error as Error).message,
            });
        }
    }

    async store(
        req: Request<{ id: string }, {}, StoreRespiratoryRatePayload>,
        res: Response
    ) {
        try {
            const { id } = req.params;
            const { timeMeasured, breathsPerMinute } = req.body;
            const respiratoryRate = await this.respiratoryRateRepository.store(
                id,
                new Date(timeMeasured),
                breathsPerMinute
            );

            res.status(201).json({
                message: "Success",
                data: respiratoryRate.dataAsJson(),
            });

            this.cache.delete(`/users/${id}/respiratory-rates`);
            this.cache.delete(`/users/${id}/vital-signs`);
        } catch (error) {
            res.status(500).json({
                message: "Internal server error",
                errors: (error as Error).message,
            });
        }
    }

    async update(
        req: Request<
            { id: string; respiratoryRateId: string },
            {},
            UpdateRespiratoryRatePayload
        >,
        res: Response
    ) {
        try {
            const { id, respiratoryRateId } = req.params;
            const { timeMeasured, breathsPerMinute } = req.body;
            const respiratoryRate = await this.respiratoryRateRepository.update(
                respiratoryRateId,
                timeMeasured ? new Date(timeMeasured) : undefined,
                breathsPerMinute
            );

            res.status(200).json({
                message: "Success",
                data: respiratoryRate.dataAsJson(),
            });

            this.cache.delete(`/users/${id}/respiratory-rates`);
            this.cache.delete(`/users/${id}/vital-signs`);
        } catch (error) {
            res.status(500).json({
                message: "Internal server error",
                errors: (error as Error).message,
            });
        }
    }

    async delete(
        req: Request<{ id: string; respiratoryRateId: string }>,
        res: Response
    ) {
        try {
            const { id, respiratoryRateId } = req.params;
            await this.respiratoryRateRepository.delete(respiratoryRateId);

            res.status(200).json({
                message: "Success",
                data: null,
            });

            this.cache.delete(`/users/${id}/respiratory-rates`);
            this.cache.delete(`/users/${id}/vital-signs`);
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
        this.router.post("/", auth, this.store.bind(this));
        this.router.put("/:respiratoryRateId", auth, this.update.bind(this));
        this.router.delete("/:respiratoryRateId", auth, this.delete.bind(this));

        this.app.use("/users/:id/respiratory-rates", this.router);
    }
}
