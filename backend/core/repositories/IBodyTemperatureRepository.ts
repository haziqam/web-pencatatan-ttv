import { BodyTemperature } from "../entities/BodyTemperature";

export interface IBodyTemperatureRepository {
    getAll(userId: string): Promise<BodyTemperature[]>;

    store(userId: string, celcius: number): Promise<BodyTemperature>;

    update(bloodPressure: BodyTemperature): Promise<BodyTemperature>;

    delete(bloodPressure: BodyTemperature): Promise<void>;
}
