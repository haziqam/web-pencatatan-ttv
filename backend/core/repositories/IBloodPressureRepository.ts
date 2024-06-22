import { BloodPressure } from "../entities/BloodPressure";

export interface IBloodPressureRepository {
    getAll(userId: string): Promise<BloodPressure[]>;

    store(
        userId: string,
        systole: number,
        diastole: number
    ): Promise<BloodPressure>;

    update(
        id: string,
        systole: number | null,
        diastole: number | null
    ): Promise<BloodPressure>;

    delete(id: string): Promise<void>;
}
