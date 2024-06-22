import { RespiratoryRate } from "../entities/RespiratoryRate";

export interface IRespiratoryRateRepository {
    getAll(userId: string): Promise<RespiratoryRate[]>;

    store(userId: string, breathsPerMinute: number): Promise<RespiratoryRate>;

    update(bloodPressure: RespiratoryRate): Promise<RespiratoryRate>;

    delete(bloodPressure: RespiratoryRate): Promise<void>;
}
