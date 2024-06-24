import { VitalSign } from "src/types/VitalSign";
import { z } from "zod";

export const storeBodyTemperatureSchema = z.object({
  timeMeasured: z.string().datetime(),
  celcius: z.number().gt(0),
});

export type StoreBodyTemperatureRequest = z.infer<
  typeof storeBodyTemperatureSchema
>;

export const updateBodyTemperatureSchema = storeBodyTemperatureSchema.partial();

export type UpdateBodyTemperatureRequest = z.infer<
  typeof updateBodyTemperatureSchema
>;

export const storeBloodPressureSchema = z.object({
  timeMeasured: z.string().datetime(),
  systole: z.number().gt(0),
  diastole: z.number().gt(0),
});

export type StoreBloodPressureRequest = z.infer<
  typeof storeBloodPressureSchema
>;

export const updateBloodPressureSchema = storeBloodPressureSchema.partial();

export type UpdateBloodPressureRequest = z.infer<
  typeof updateBloodPressureSchema
>;

export const storeHeartBeatSchema = z.object({
  timeMeasured: z.string().datetime(),
  beatsPerMinute: z.number().gt(0),
});

export type StoreHeartBeatRequest = z.infer<typeof storeHeartBeatSchema>;

export const updateHeartBeatSchema = storeHeartBeatSchema.partial();

export type UpdateHeartBeatRequest = z.infer<typeof updateHeartBeatSchema>;

export const storeRespiratoryRateSchema = z.object({
  timeMeasured: z.string().datetime(),
  breathsPerMinute: z.number().gt(0),
});

export type StoreRespiratoryRateRequest = z.infer<
  typeof storeRespiratoryRateSchema
>;

export const updateRespiratoryRateSchema = storeRespiratoryRateSchema.partial();

export type UpdateRespiratoryRateRequest = z.infer<
  typeof updateRespiratoryRateSchema
>;

export type VitalSignResponse = {
  message: string;
  data?: VitalSign[];
};
