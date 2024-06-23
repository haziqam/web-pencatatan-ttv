import { Json } from "./Json";
import { VitalSign } from "./VitalSign";

export class HeartBeat extends VitalSign {
    private static readonly NORMAL_THRESHOLD = [60, 100];

    constructor(
        private beatsPerMinute: number,

        userId: string,
        timeMeasured: Date,
        id?: string,
        status?: string
    ) {
        super(userId, timeMeasured, id, "HEART_BEAT");

        if (status) {
            this.status = status;
        } else {
            this.calculateStatus();
        }
    }

    private calculateStatus() {
        const threshold = HeartBeat.NORMAL_THRESHOLD;
        if (this.beatsPerMinute < threshold[0]) {
            this.status = "LOW";
        } else if (
            this.beatsPerMinute >= threshold[0] &&
            this.beatsPerMinute <= threshold[1]
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
            beatsPerMinute: this.beatsPerMinute,
        };
    }
}
