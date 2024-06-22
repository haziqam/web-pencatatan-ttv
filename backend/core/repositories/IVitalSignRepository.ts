export interface IVitalSignRepository {
    getAll(userId: string): Promise<VitalSign[]>;
}
