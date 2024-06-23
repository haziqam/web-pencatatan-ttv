import { Json } from "./Json";
import { VitalSign } from "./VitalSign";

export class BloodPressure extends VitalSign {
    constructor(
        private systole: number,
        private diastole: number,

        userId: string,
        timeMeasured: Date,
        id?: string,
        status?: string
    ) {
        super(userId, timeMeasured, id, "BLOOD_PRESSURE");

        if (status) {
            this.status = status;
        } else {
            this.status = BloodPressure.calculateStatus(
                this.systole,
                this.diastole
            );
        }
    }

    static calculateStatus(sys: number, dia: number): string {
        if (sys < 90 || dia < 60) {
            return "HYPOTENSION";
        } else if (sys >= 90 && sys <= 119 && dia >= 60 && dia <= 79) {
            return "NORMAL";
        } else if ((sys >= 120 && sys <= 139) || (dia >= 80 && dia <= 89)) {
            return "PRE-HYPERTENSION";
        } else if ((sys >= 140 && sys <= 159) || (dia >= 90 && dia <= 99)) {
            return "STAGE 1 HYPERTENSION";
        } else if ((sys >= 160 && sys <= 180) || (dia >= 100 && dia <= 120)) {
            return "STAGE 2 HYPERTENSION";
        } else if (sys > 180 || dia > 120) {
            return "HYPERTENSIVE CRISIS";
        }
        return "UNKNOWN";
    }

    dataAsJson(): Json {
        return {
            id: this.id,
            name: this.name,
            userId: this.userId,
            timeMeasured: this.timeMeasured,
            status: this.status,
            systole: this.systole,
            diastole: this.diastole,
        };
    }
}
