import * as redis from "redis";
import { ICache } from "../../caches/ICache";

export type RedisClientType = ReturnType<typeof redis.createClient>;

export class Cache implements ICache {
    constructor(private client: RedisClientType) {}

    async get(key: string): Promise<string | null> {
        const value = await this.client.get(key);
        return value;
    }

    async set(key: string, value: string): Promise<void> {
        await this.client.set(key, value);
    }

    async delete(key: string): Promise<void> {
        await this.client.del(key);
    }
}
