type VitalSignCommon = {
  id: string;
  name: string;
  userId: string;
  timeMeasured: string;
  status: string;
};

export type BodyTemperature = VitalSignCommon & {
  name: "BODY_TEMPERATURE";
  celcius: number;
};

export type HeartBeat = VitalSignCommon & {
  name: "HEART_BEAT";
  beatsPerMinute: number;
};

export type RespiratoryRate = VitalSignCommon & {
  name: "RESPIRATORY_RATE";
  breathsPerMinute: number;
};

export type BloodPressure = VitalSignCommon & {
  name: "BLOOD_PRESSURE";
  systole: number;
  diastole: number;
};

export type VitalSign =
  | BodyTemperature
  | HeartBeat
  | RespiratoryRate
  | BloodPressure;
