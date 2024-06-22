import { BodyTemperature } from "../entities/BodyTemperature";

export interface IBodyTemperatureRepository {
    getAll(userId: string): Promise<BodyTemperature[]>;

    store(userId: string, celcius: number): Promise<BodyTemperature>;

    update(id: string, celcius: number): Promise<BodyTemperature>;

    delete(id: string): Promise<void>;
}
