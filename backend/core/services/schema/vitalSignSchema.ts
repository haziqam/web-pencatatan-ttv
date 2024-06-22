import { z } from "zod";

export const bodyTemperatureSchema = z.object({
    celcius: z.number().gt(0),
});

export type BodyTemperaturePayload = z.infer<typeof bodyTemperatureSchema>;

export const storeBloodPressureSchema = z.object({
    systole: z.number().gt(0),
    diastole: z.number().gt(0),
});

export type StoreBloodPressurePayload = z.infer<
    typeof storeBloodPressureSchema
>;

export const updateBloodPressureSchema = storeBloodPressureSchema.partial();

export type UpdateBloodPressurePayload = z.infer<
    typeof updateBloodPressureSchema
>;

export const heartBeatSchema = z.object({
    beatsPerMinute: z.number().gt(0),
});

export type HeartBeatPayload = z.infer<typeof heartBeatSchema>;

export const respiratoryRateSchema = z.object({
    breathsPerMinute: z.number().gt(0),
});

export type RespiratoryRatePayload = z.infer<typeof respiratoryRateSchema>;
