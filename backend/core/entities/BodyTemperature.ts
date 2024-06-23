import { Json } from "./Json";
import { VitalSign } from "./VitalSign";

export class BodyTemperature extends VitalSign {
    private static readonly NORMAL_THRESHOLD = [36.5, 37.5];

    constructor(
        public celcius: number,

        userId: string,
        timeMeasured: Date,
        id?: string,
        status?: string
    ) {
        super(userId, timeMeasured, id, "BODY_TEMPERATURE");

        if (status) {
            this.status = status;
        } else {
            this.status = BodyTemperature.calculateStatus(this.celcius);
        }
    }

    static calculateStatus(celcius: number): string {
        const threshold = BodyTemperature.NORMAL_THRESHOLD;
        if (celcius < threshold[0]) {
            return "LOW";
        } else if (celcius >= threshold[0] && celcius <= threshold[1]) {
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
            celcius: this.celcius,
        };
    }
}
