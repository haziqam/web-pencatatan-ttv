import { z } from "zod";

export const storeBodyTemperatureSchema = z.object({
    timeMeasured: z.string().datetime(),
    celcius: z.number().gt(0),
});

export type StoreBodyTemperaturePayload = z.infer<
    typeof storeBodyTemperatureSchema
>;

export const updateBodyTemperatureSchema = storeBodyTemperatureSchema.partial();

export type UpdateBodyTemperaturePayload = z.infer<
    typeof updateBodyTemperatureSchema
>;

export const storeBloodPressureSchema = z.object({
    timeMeasured: z.string().datetime(),
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

export const storeHeartBeatSchema = z.object({
    timeMeasured: z.string().datetime(),
    beatsPerMinute: z.number().gt(0),
});

export type StoreHeartBeatPayload = z.infer<typeof storeHeartBeatSchema>;

export const updateHeartBeatSchema = storeHeartBeatSchema.partial();

export type UpdateHeartBeatPayload = z.infer<typeof updateHeartBeatSchema>;

export const storeRespiratoryRateSchema = z.object({
    timeMeasured: z.string().datetime(),
    breathsPerMinute: z.number().gt(0),
});

export type StoreRespiratoryRatePayload = z.infer<
    typeof storeRespiratoryRateSchema
>;

export const updateRespiratoryRateSchema = storeRespiratoryRateSchema.partial();

export type UpdateRespiratoryRatePayload = z.infer<
    typeof updateRespiratoryRateSchema
>;
