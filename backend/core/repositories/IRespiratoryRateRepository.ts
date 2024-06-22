import { RespiratoryRate } from "../entities/RespiratoryRate";

export interface IRespiratoryRateRepository {
    getAll(userId: string): RespiratoryRate[];

    store(userId: string, breathsPerMinute: number): RespiratoryRate;

    update(bloodPressure: RespiratoryRate): RespiratoryRate;

    delete(bloodPressure: RespiratoryRate): void;
}
