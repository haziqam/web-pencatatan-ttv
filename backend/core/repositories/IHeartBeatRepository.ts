import { HeartBeat } from "../entities/HeartBeat";

export interface IHeartBeatRepository {
    getAll(userId: string): Promise<HeartBeat[]>;

    store(userId: string, beatsPerMinute: number): Promise<HeartBeat>;

    update(bloodPressure: HeartBeat): Promise<HeartBeat>;

    delete(bloodPressure: HeartBeat): Promise<void>;
}
