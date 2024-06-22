export class BodyTemperature extends VitalSign {
    private static readonly NORMAL_THRESHOLD = [36.5, 37.5];

    constructor(
        private celcius: number,

        id: string,
        userId: string,
        timeMeasured: Date,
        status?: string
    ) {
        super(id, "BODY_TEMPERATURE", userId, timeMeasured);

        if (status) {
            this.status = status;
        } else {
            this.calculateStatus();
        }
    }

    private calculateStatus() {
        const threshold = BodyTemperature.NORMAL_THRESHOLD;
        if (this.celcius < threshold[0]) {
            this.status = "LOW";
        } else if (
            this.celcius >= threshold[0] &&
            this.celcius <= threshold[1]
        ) {
            this.status = "NORMAL";
        } else {
            this.status = "HIGH";
        }
    }

    dataAsJson(): Json {
        return {
            id: this.userId,
            userId: this.userId,
            timeMeasured: this.timeMeasured,
            status: this.status,
            celcius: this.celcius,
        };
    }
}
