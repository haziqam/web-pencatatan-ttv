import { HeartBeat } from "../entities/HeartBeat";

export interface IHeartBeatRepository {
    getAll(userId: string): HeartBeat[];

    store(userId: string, beatsPerMinute: number): HeartBeat;

    update(bloodPressure: HeartBeat): HeartBeat;

    delete(bloodPressure: HeartBeat): void;
}
