import dotenv from "dotenv";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { MongoClient } from "mongodb";
import * as redis from "redis";
import { UserRepository } from "./adapters/mongodb/UserRepository";
import { BloodPressureRepository } from "./adapters/mongodb/BloodPressureRepository";
import { BodyTemperatureRepository } from "./adapters/mongodb/BodyTemperatureRepository";
import { HeartBeatRepository } from "./adapters/mongodb/HeartBeatRepository";
import { RespiratoryRateRepository } from "./adapters/mongodb/RespiratoryRateRepository";
import { VitalSignRepository } from "./adapters/mongodb/VitalSignRepository";
import { Cache } from "./adapters/redis/Cache";
import { AccountService } from "./core/services/impl/AccountService";
import { IService } from "./core/services/IService";
import { BloodPressureService } from "./core/services/impl/BloodPressureService";
import { BodyTemperatureService } from "./core/services/impl/BodyTemperatureService";
import { HeartBeatService } from "./core/services/impl/HeartBeatService";
import { RespiratoryRateService } from "./core/services/impl/RespiratoryRateService";
import { VitalSignService } from "./core/services/impl/VitalSignService";

export class App {
    constructor() {}

    async start() {
        dotenv.config();

        // MongoDB
        const mongoUri = process.env.CONN_STRING!;
        const dbName = process.env.DB_NAME || "TTV";
        const mongoClient = new MongoClient(mongoUri);
        await mongoClient.connect();
        const db = mongoClient.db(dbName);
        const userCollection = db.collection("User");
        await userCollection.createIndex({ email: 1 }, { unique: true });
        const vitalSignCollection = db.collection("VitalSign");

        // Redis
        const redisUrl = process.env.REDIS_URL!;
        const redisClient = redis.createClient({
            url: redisUrl,
        });
        redisClient.on("error", (err) =>
            console.log("Redis Client Error", err)
        );
        await redisClient.connect();

        // Repositories
        const userRepository = new UserRepository(userCollection);
        const bloodPressureRepository = new BloodPressureRepository(
            vitalSignCollection
        );
        const bodyTemperatureRepository = new BodyTemperatureRepository(
            vitalSignCollection
        );
        const heartBeatRepository = new HeartBeatRepository(
            vitalSignCollection
        );
        const respiratoryRateRepository = new RespiratoryRateRepository(
            vitalSignCollection
        );
        const vitalSignRepository = new VitalSignRepository(
            bloodPressureRepository,
            bodyTemperatureRepository,
            heartBeatRepository,
            respiratoryRateRepository
        );

        // Cache
        const cache = new Cache(redisClient);

        // Express
        const server = express();
        const port = process.env.EXPRESS_PORT ?? 3000;
        server.use(express.json());
        server.use(bodyParser.json());
        server.use(cookieParser());
        const frontendPort = process.env.VUE_PORT ?? 5173;
        server.use(
            cors({
                origin: `http://localhost:${frontendPort}`,
                credentials: true,
            })
        );

        // Services
        const services: IService[] = [
            new AccountService(server, userRepository, cache),
            new BloodPressureService(server, bloodPressureRepository, cache),
            new BodyTemperatureService(
                server,
                bodyTemperatureRepository,
                cache
            ),
            new HeartBeatService(server, heartBeatRepository, cache),
            new RespiratoryRateService(
                server,
                respiratoryRateRepository,
                cache
            ),
            new VitalSignService(server, vitalSignRepository, cache),
        ];

        services.forEach((s) => {
            s.registerRoutes();
        });

        server.get("/health", (req: Request, res: Response) => {
            res.send("Route is working!");
        });

        server.listen(port, async () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
}
