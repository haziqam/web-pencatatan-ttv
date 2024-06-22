import { HeartBeat } from "../entities/HeartBeat";

export interface IHeartBeatRepository {
    getAll(userId: string): Promise<HeartBeat[]>;

    store(userId: string, beatsPerMinute: number): Promise<HeartBeat>;

    update(id: string, beatsPerMinute: number): Promise<HeartBeat>;

    delete(id: string): Promise<void>;
}
