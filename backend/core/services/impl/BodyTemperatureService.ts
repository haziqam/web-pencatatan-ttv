import { ICache } from "../../../caches/ICache";
import { IBodyTemperatureRepository } from "../../repositories/IBodyTemperatureRepository";
import { IService } from "../IService";
import { Express, NextFunction, Request, Response, Router } from "express";
import {
    StoreBodyTemperaturePayload,
    UpdateBodyTemperaturePayload,
} from "../schema/vitalSignSchema";
import { auth } from "../middlewares/auth";

export class BodyTemperatureService implements IService {
    private router: Router;

    constructor(
        private app: Express,
        private bodyTemperatureRepository: IBodyTemperatureRepository,
        private cache: ICache
    ) {
        this.router = Router({ mergeParams: true });
    }

    async cacheGetAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const cachedBodyTemperatures = await this.cache.get(
                `/users/${id}/body-temperatures`
            );

            if (!cachedBodyTemperatures) {
                return next();
            }

            res.status(200).json({
                message: "Success",
                data: JSON.parse(cachedBodyTemperatures),
            });
        } catch (error) {
            next();
        }
    }

    async getAll(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            const bodyTemperatures =
                await this.bodyTemperatureRepository.getAll(id);
            const bodyTemperaturesJson = bodyTemperatures.map((v) =>
                v.dataAsJson()
            );

            res.status(200).json({
                message: "Success",
                data: bodyTemperaturesJson,
            });

            this.cache.set(
                `/users/${id}/body-temperatures`,
                JSON.stringify(bodyTemperaturesJson)
            );
        } catch (error) {
            res.status(500).json({
                message: "Internal server error",
                errors: (error as Error).message,
            });
        }
    }

    async store(
        req: Request<{ id: string }, {}, StoreBodyTemperaturePayload>,
        res: Response
    ) {
        try {
            const { id } = req.params;
            const { timeMeasured, celcius } = req.body;
            const bodyTemperature = await this.bodyTemperatureRepository.store(
                id,
                new Date(timeMeasured),
                celcius
            );

            res.status(201).json({
                message: "Success",
                data: bodyTemperature.dataAsJson(),
            });

            this.cache.delete(`/users/${id}/body-temperatures`);
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
            { id: string; tempId: string },
            {},
            UpdateBodyTemperaturePayload
        >,
        res: Response
    ) {
        try {
            const { id, tempId } = req.params;
            const { timeMeasured, celcius } = req.body;
            const bodyTemperature = await this.bodyTemperatureRepository.update(
                tempId,
                timeMeasured ? new Date(timeMeasured) : undefined,
                celcius
            );

            res.status(200).json({
                message: "Success",
                data: bodyTemperature.dataAsJson(),
            });

            this.cache.delete(`/users/${id}/body-temperatures`);
            this.cache.delete(`/users/${id}/vital-signs`);
        } catch (error) {
            res.status(500).json({
                message: "Internal server error",
                errors: (error as Error).message,
            });
        }
    }

    async delete(req: Request<{ id: string; tempId: string }>, res: Response) {
        try {
            const { id, tempId } = req.params;
            await this.bodyTemperatureRepository.delete(tempId);

            res.status(200).json({
                message: "Success",
                data: null,
            });

            this.cache.delete(`/users/${id}/body-temperatures`);
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
            auth,
            this.cacheGetAll.bind(this),
            this.getAll.bind(this)
        );
        this.router.post("/", auth, this.store.bind(this));
        this.router.put("/:tempId", auth, this.update.bind(this));
        this.router.delete("/:tempId", auth, this.delete.bind(this));

        this.app.use("/users/:id/body-temperatures", this.router);
    }
}
