import { BloodPressure } from "../entities/BloodPressure";

export interface IBloodPressureRepository {
    getAll(userId: string): Promise<BloodPressure[]>;

    store(
        userId: string,
        systole: number,
        diastole: number
    ): Promise<BloodPressure>;

    update(bloodPressure: BloodPressure): Promise<BloodPressure>;

    delete(bloodPressure: BloodPressure): Promise<void>;
}
