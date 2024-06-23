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
            this.status = HeartBeat.calculateStatus(beatsPerMinute);
        }
    }

    static calculateStatus(beatsPerMinute: number): string {
        const threshold = HeartBeat.NORMAL_THRESHOLD;
        if (beatsPerMinute < threshold[0]) {
            return "LOW";
        } else if (
            beatsPerMinute >= threshold[0] &&
            beatsPerMinute <= threshold[1]
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
            beatsPerMinute: this.beatsPerMinute,
        };
    }
}
