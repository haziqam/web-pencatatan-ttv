export class HeartBeat extends VitalSign {
    private static readonly NORMAL_THRESHOLD = [60, 100];

    constructor(
        private beatsPerMinute: number,

        id: string,
        userId: string,
        timeMeasured: Date,
        status?: string
    ) {
        super(id, "HEART_BEAT", userId, timeMeasured);

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
            id: this.userId,
            userId: this.userId,
            timeMeasured: this.timeMeasured,
            status: this.status,
            beatsPerMinute: this.beatsPerMinute,
        };
    }
}
