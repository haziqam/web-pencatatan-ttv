import { BloodPressure } from "../entities/BloodPressure";

export interface IBloodPressureRepository {
    getAll(userId: string): Promise<BloodPressure[]>;

    store(
        userId: string,
        timeMeasured: Date,
        systole: number,
        diastole: number
    ): Promise<BloodPressure>;

    update(
        id: string,
        timeMeasured?: Date,
        systole?: number,
        diastole?: number
    ): Promise<BloodPressure>;

    delete(id: string): Promise<void>;
}
