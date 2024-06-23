import { Json } from "./Json";

export abstract class VitalSign {
    public status: string = "";

    constructor(
        public userId: string,
        public timeMeasured: Date,
        public id?: string,
        public name: string = ""
    ) {}

    abstract dataAsJson(): Json;
}
