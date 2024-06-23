import { BodyTemperature } from "../entities/BodyTemperature";

export interface IBodyTemperatureRepository {
    getAll(userId: string): Promise<BodyTemperature[]>;

    store(
        userId: string,
        timeMeasured: Date,
        celcius: number
    ): Promise<BodyTemperature>;

    update(
        id: string,
        timeMeasured?: Date,
        celcius?: number
    ): Promise<BodyTemperature>;

    delete(id: string): Promise<void>;
}
