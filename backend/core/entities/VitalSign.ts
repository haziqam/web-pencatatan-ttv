abstract class VitalSign {
    protected status: string = "";

    constructor(
        protected readonly id: string,
        protected name: string = "",
        protected userId: string,
        protected timeMeasured: Date
    ) {}

    abstract dataAsJson(): Json;
}

type Json = {
    [key: string]: any;
};
