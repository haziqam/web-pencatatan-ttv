import { RespiratoryRate } from "../entities/RespiratoryRate";

export interface IRespiratoryRateRepository {
    getAll(userId: string): Promise<RespiratoryRate[]>;

    store(userId: string, breathsPerMinute: number): Promise<RespiratoryRate>;

    update(id: string, breathsPerMinute: number): Promise<RespiratoryRate>;

    delete(id: string): Promise<void>;
}
