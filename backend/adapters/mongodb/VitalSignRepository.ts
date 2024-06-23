import { VitalSign } from "../../core/entities/VitalSign";
import { IVitalSignRepository } from "../../core/repositories/IVitalSignRepository";
import { BloodPressureRepository } from "./BloodPressureRepository";
import { BodyTemperatureRepository } from "./BodyTemperatureRepository";
import { HeartBeatRepository } from "./HeartBeatRepository";
import { RespiratoryRateRepository } from "./RespiratoryRateRepository";

export class VitalSignRepository implements IVitalSignRepository {
    constructor(
        private bloodPressureReopsitory: BloodPressureRepository,
        private bodyTemperatureRepository: BodyTemperatureRepository,
        private heartBeatRepository: HeartBeatRepository,
        private respiratoryRateRepository: RespiratoryRateRepository
    ) {}

    async getAll(userId: string): Promise<VitalSign[]> {
        const result = await Promise.all([
            this.bloodPressureReopsitory.getAll(userId),
            this.bodyTemperatureRepository.getAll(userId),
            this.heartBeatRepository.getAll(userId),
            this.respiratoryRateRepository.getAll(userId),
        ]);

        return result
            .flat()
            .sort(
                (a, b) => b.timeMeasured.getTime() - a.timeMeasured.getTime()
            );
    }
}
