import { ICache } from "../../../caches/ICache";
import { IHeartBeatRepository } from "../../repositories/IHeartBeatRepository";
import { IService } from "../IService";
import { Express, NextFunction, Request, Response, Router } from "express";
import { HeartBeatPayload } from "../schema/vitalSignSchema";

export class HeartBeatService implements IService {
    private router: Router;

    constructor(
        private app: Express,
        private heartBeatRepository: IHeartBeatRepository,
        private cache: ICache
    ) {
        this.router = Router();
    }

    async cacheGetAll(
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const cachedHeartBeats = await this.cache.get(
                `/users/${id}/heart-beats`
            );

            if (!cachedHeartBeats) {
                return next();
            }

            res.send(200).json({
                message: "Success",
                data: JSON.parse(cachedHeartBeats),
            });
        } catch (error) {
            next();
        }
    }

    async getAll(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            const heartBeats = await this.heartBeatRepository.getAll(id);
            const heartBeatsJson = heartBeats.map((v) => v.dataAsJson());

            res.send(200).json({
                message: "Success",
                data: heartBeatsJson,
            });

            this.cache.set(
                `/users/${id}/heart-beats`,
                JSON.stringify(heartBeatsJson)
            );
        } catch (error) {
            res.status(500).json({
                message: "Internal server error",
                errors: (error as Error).message,
            });
        }
    }

    async store(
        req: Request<{ id: string }, {}, HeartBeatPayload>,
        res: Response
    ) {
        try {
            const { id } = req.params;
            const { beatsPerMinute } = req.body;
            const heartBeat = await this.heartBeatRepository.store(
                id,
                beatsPerMinute
            );

            res.send(201).json({
                message: "Success",
                data: heartBeat.dataAsJson(),
            });

            this.cache.delete(`/users/${id}/heart-beats`);
            this.cache.delete(`/users/${id}/vital-signs`);
        } catch (error) {
            res.status(500).json({
                message: "Internal server error",
                errors: (error as Error).message,
            });
        }
    }

    async update(
        req: Request<{ id: string; heartBeatId: string }, {}, HeartBeatPayload>,
        res: Response
    ) {
        try {
            const { id, heartBeatId } = req.params;
            const { beatsPerMinute } = req.body;
            const heartBeat = await this.heartBeatRepository.update(
                heartBeatId,
                beatsPerMinute
            );

            res.send(200).json({
                message: "Success",
                data: heartBeat.dataAsJson(),
            });

            this.cache.delete(`/users/${id}/heart-beats`);
            this.cache.delete(`/users/${id}/vital-signs`);
        } catch (error) {
            res.status(500).json({
                message: "Internal server error",
                errors: (error as Error).message,
            });
        }
    }

    async delete(
        req: Request<{ id: string; heartBeatId: string }>,
        res: Response
    ) {
        try {
            const { id, heartBeatId } = req.params;
            await this.heartBeatRepository.delete(heartBeatId);

            res.send(200).json({
                message: "Success",
                data: null,
            });

            this.cache.delete(`/users/${id}/heart-beats`);
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
        this.router.put("/:heartBeatId", this.update.bind(this));
        this.router.delete("/:heartBeatId", this.delete.bind(this));

        this.app.use("/users/:id/heart-beats", this.router);
    }
}
