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
                    userId: userId,
                },
            },
            {
                $project: {
                    _id: 0,
                    id: { $toString: "$_id" },
                    userId: 1,
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
        const heartBeat = await this.collection.findOne({
            _id: new ObjectId(id),
        });

        if (!heartBeat) {
            throw new Error("Id not found. Cannot update HeartBeat document");
        }

        const newBeatsPerMinute = beatsPerMinute ?? heartBeat.beatsPerMinute;
        const newStatus = HeartBeat.calculateStatus(newBeatsPerMinute);
        const newTimeMeasured = timeMeasured ?? heartBeat.timeMeasured;

        await this.collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    timeMeasured: newTimeMeasured,
                    beatsPerMinute: newBeatsPerMinute,
                    status: newStatus,
                },
            },
            { ignoreUndefined: true }
        );

        return new HeartBeat(
            newBeatsPerMinute,
            heartBeat.userId,
            newTimeMeasured,
            id
        );
    }

    async delete(id: string): Promise<void> {
        await this.collection.deleteOne({
            _id: new ObjectId(id),
        });
    }
}
