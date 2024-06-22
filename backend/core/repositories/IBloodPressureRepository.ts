import { BloodPressure } from "../entities/BloodPressure";

export interface IBloodPressureRepository {
    getAll(userId: string): BloodPressure[];

    store(userId: string, systole: number, diastole: number): BloodPressure;

    update(bloodPressure: BloodPressure): BloodPressure;

    delete(bloodPressure: BloodPressure): void;
}
