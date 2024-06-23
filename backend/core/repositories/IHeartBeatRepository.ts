import { HeartBeat } from "../entities/HeartBeat";

export interface IHeartBeatRepository {
    getAll(userId: string): Promise<HeartBeat[]>;

    store(
        userId: string,
        timeMeasured: Date,
        beatsPerMinute: number
    ): Promise<HeartBeat>;

    update(
        id: string,
        timeMeasured?: Date,
        beatsPerMinute?: number
    ): Promise<HeartBeat>;

    delete(id: string): Promise<void>;
}
