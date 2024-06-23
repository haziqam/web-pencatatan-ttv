import { ICache } from "../../../caches/ICache";
import { IBloodPressureRepository } from "../../repositories/IBloodPressureRepository";
import { IService } from "../IService";
import { Express, NextFunction, Request, Response, Router } from "express";
import {
    StoreBloodPressurePayload,
    UpdateBloodPressurePayload,
} from "../schema/vitalSignSchema";

export class BloodPressureService implements IService {
    private router: Router;

    constructor(
        private app: Express,
        private bloodPressureRepository: IBloodPressureRepository,
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
            const cachedBloodPressures = await this.cache.get(
                `/users/${id}/blood-pressures`
            );

            if (!cachedBloodPressures) {
                return next();
            }

            res.status(200).json({
                message: "Success",
                data: JSON.parse(cachedBloodPressures),
            });
        } catch (error) {
            next();
        }
    }

    async getAll(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            const bloodPressures = await this.bloodPressureRepository.getAll(
                id
            );
            const bloodPressuresJson = bloodPressures.map((v) =>
                v.dataAsJson()
            );

            res.status(200).json({
                message: "Success",
                data: bloodPressuresJson,
            });

            this.cache.set(
                `/users/${id}/blood-pressures`,
                JSON.stringify(bloodPressuresJson)
            );
        } catch (error) {
            res.status(500).json({
                message: "Internal server error",
                errors: (error as Error).message,
            });
        }
    }

    async store(
        req: Request<{ id: string }, {}, StoreBloodPressurePayload>,
        res: Response
    ) {
        try {
            const { id } = req.params;
            const { timeMeasured, systole, diastole } = req.body;
            const bloodPressure = await this.bloodPressureRepository.store(
                id,
                new Date(timeMeasured),
                systole,
                diastole
            );

            res.status(201).json({
                message: "Success",
                data: bloodPressure.dataAsJson(),
            });

            this.cache.delete(`/users/${id}/blood-pressures`);
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
            { id: string; bloodPressureId: string },
            {},
            UpdateBloodPressurePayload
        >,
        res: Response
    ) {
        try {
            const { id, bloodPressureId } = req.params;
            const { timeMeasured, systole, diastole } = req.body;
            const bloodPressure = await this.bloodPressureRepository.update(
                bloodPressureId,
                timeMeasured ? new Date(timeMeasured) : undefined,
                systole,
                diastole
            );

            res.status(200).json({
                message: "Success",
                data: bloodPressure.dataAsJson(),
            });

            this.cache.delete(`/users/${id}/blood-pressures`);
            this.cache.delete(`/users/${id}/vital-signs`);
        } catch (error) {
            res.status(500).json({
                message: "Internal server error",
                errors: (error as Error).message,
            });
        }
    }

    async delete(
        req: Request<{ id: string; bloodPressureId: string }>,
        res: Response
    ) {
        try {
            const { id, bloodPressureId } = req.params;
            await this.bloodPressureRepository.delete(bloodPressureId);

            res.status(200).json({
                message: "Success",
                data: null,
            });

            this.cache.delete(`/users/${id}/blood-pressures`);
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
        this.router.post("/", this.store.bind(this));
        this.router.put("/:bloodPressureId", this.update.bind(this));
        this.router.delete("/:bloodPressureId", this.delete.bind(this));

        this.app.use("/users/:id/blood-pressures", this.router);
    }
}
