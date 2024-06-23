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
            this.calculateStatus();
        }
    }

    private calculateStatus() {
        const threshold = RespiratoryRate.NORMAL_THRESHOLD;
        if (this.breathsPerMinute < threshold[0]) {
            this.status = "LOW";
        } else if (
            this.breathsPerMinute >= threshold[0] &&
            this.breathsPerMinute <= threshold[1]
        ) {
            this.status = "NORMAL";
        } else {
            this.status = "HIGH";
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
