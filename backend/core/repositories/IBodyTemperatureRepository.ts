import { BodyTemperature } from "../entities/BodyTemperature";

export interface IBodyTemperatureRepository {
    getAll(userId: string): BodyTemperature[];

    store(userId: string, celcius: number): BodyTemperature;

    update(bloodPressure: BodyTemperature): BodyTemperature;

    delete(bloodPressure: BodyTemperature): void;
}
