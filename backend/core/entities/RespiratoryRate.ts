import { Json } from "./Json";
import { VitalSign } from "./VitalSign";

export class RespiratoryRate extends VitalSign {
    private static readonly NORMAL_THRESHOLD = [12, 20];

    constructor(
        private breathsPerMinute: number,

        userId: string,
        timeMeasured: Date,
        id?: string,
        status?: string
    ) {
        super(userId, timeMeasured, id, "RESPIRATORY_RATE");

        if (status) {
            this.status = status;
        } else {
            this.status = RespiratoryRate.calculateStatus(
                this.breathsPerMinute
            );
        }
    }

    static calculateStatus(breathsPerMinute: number): string {
        const threshold = RespiratoryRate.NORMAL_THRESHOLD;
        if (breathsPerMinute < threshold[0]) {
            return "LOW";
        } else if (
            breathsPerMinute >= threshold[0] &&
            breathsPerMinute <= threshold[1]
        ) {
            return "NORMAL";
        } else {
            return "HIGH";
        }
    }

    dataAsJson(): Json {
        return {
            id: this.id,
            name: this.name,
            userId: this.userId,
            timeMeasured: this.timeMeasured,
            status: this.status,
            breathsPerMinute: this.breathsPerMinute,
        };
    }
}
