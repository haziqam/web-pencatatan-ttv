export interface IVitalSignRepository {
    getAll(userId: string): VitalSign[];
}
