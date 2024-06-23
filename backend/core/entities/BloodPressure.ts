export class BloodPressure extends VitalSign {
    constructor(
        private systole: number,
        private diastole: number,

        timeMeasured: Date,
        userId: string,
        id?: string,
        status?: string
    ) {
        super(userId, timeMeasured, id, "BLOOD_PRESSURE");

        if (status) {
            this.status = status;
        } else {
            this.calculateStatus();
        }
    }

    private calculateStatus() {
        const sys = this.systole;
        const dia = this.diastole;

        if (sys < 90 || dia < 60) {
            this.status = "HYPOTENSION";
        } else if (sys >= 90 && sys <= 119 && dia >= 60 && dia <= 79) {
            this.status = "NORMAL";
        } else if ((sys >= 120 && sys <= 139) || (dia >= 80 && dia <= 89)) {
            this.status = "PRE-HYPERTENSION";
        } else if ((sys >= 140 && sys <= 159) || (dia >= 90 && dia <= 99)) {
            this.status = "STAGE 1 HYPERTENSION";
        } else if ((sys >= 160 && sys <= 180) || (dia >= 100 && dia <= 120)) {
            this.status = "STAGE 2 HYPERTENSION";
        } else if (sys > 180 || dia > 120) {
            this.status = "HYPERTENSIVE CRISIS";
        }
    }

    dataAsJson(): Json {
        return {
            id: this.userId,
            userId: this.userId,
            timeMeasured: this.timeMeasured,
            status: this.status,
            systole: this.systole,
            diastole: this.diastole,
        };
    }
}
