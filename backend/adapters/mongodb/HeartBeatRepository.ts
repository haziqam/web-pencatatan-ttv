import { Collection, ObjectId } from "mongodb";
import { HeartBeat } from "../../core/entities/HeartBeat";
import { IHeartBeatRepository } from "../../core/repositories/IHeartBeatRepository";

export class HeartBeatRepository implements IHeartBeatRepository {
    constructor(private collection: Collection) {}

    async getAll(userId: string): Promise<HeartBeat[]> {
        const pipeline = [
            {
                $match: {
                    name: "HEART_BEAT",
                    userId: new ObjectId(userId),
                },
            },
            {
                $project: {
                    _id: 0,
                    id: { $toString: "$_id" },
                    userId: { $toString: "$userId" },
                    timeMeasured: 1,
                    status: 1,
                    beatsPerMinute: 1,
                },
            },
        ];

        const result = await this.collection.aggregate(pipeline).toArray();
        return result.map(
            (r) =>
                new HeartBeat(
                    r.beatsPerMinute,
                    r.userId,
                    r.timeMeasured,
                    r.id,
                    r.status
                )
        );
    }

    async store(
        userId: string,
        timeMeasured: Date,
        beatsPerMinute: number
    ): Promise<HeartBeat> {
        const heartBeat = new HeartBeat(beatsPerMinute, userId, timeMeasured);
        const data = heartBeat.dataAsJson();
        const result = await this.collection.insertOne(data, {
            ignoreUndefined: true,
        });
        heartBeat.id = result.insertedId.toString();
        return heartBeat;
    }

    async update(
        id: string,
        timeMeasured?: Date | undefined,
        beatsPerMinute?: number | undefined
    ): Promise<HeartBeat> {
        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { timeMeasured, beatsPerMinute } },
            { ignoreUndefined: true, returnDocument: "after" }
        );

        if (!result) {
            throw new Error("Id not found. Cannot update HeartBeat document");
        }

        return new HeartBeat(
            result.beatsPerMinute,
            result.userId,
            result.timeMeasured,
            result.id,
            result.status
        );
    }

    async delete(id: string): Promise<void> {
        await this.collection.deleteOne({
            _id: new ObjectId(id),
        });
    }
}
