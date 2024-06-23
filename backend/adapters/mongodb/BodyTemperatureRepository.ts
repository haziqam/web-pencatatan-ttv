import { BodyTemperature } from "../../core/entities/BodyTemperature";
import { IBodyTemperatureRepository } from "../../core/repositories/IBodyTemperatureRepository";
import { Collection, ObjectId } from "mongodb";

export class BodyTemperatureRepository implements IBodyTemperatureRepository {
    constructor(private collection: Collection) {}
    async getAll(userId: string): Promise<BodyTemperature[]> {
        const pipeline = [
            {
                $match: {
                    name: "BODY_TEMPERATURE",
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
                    celcius: 1,
                },
            },
        ];

        const result = await this.collection.aggregate(pipeline).toArray();
        return result.map(
            (r) =>
                new BodyTemperature(
                    r.celcius,
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
        celcius: number
    ): Promise<BodyTemperature> {
        const bodyTemperature = new BodyTemperature(
            celcius,
            userId,
            timeMeasured
        );
        const data = bodyTemperature.dataAsJson();
        const result = await this.collection.insertOne(data, {
            ignoreUndefined: true,
        });
        bodyTemperature.id = result.insertedId.toString();
        return bodyTemperature;
    }

    async update(
        id: string,
        timeMeasured?: Date | undefined,
        celcius?: number | undefined
    ): Promise<BodyTemperature> {
        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { timeMeasured, celcius } },
            { ignoreUndefined: true, returnDocument: "after" }
        );

        if (!result) {
            throw new Error(
                "Id not found. Cannot update BodyTemperature document"
            );
        }

        return new BodyTemperature(
            result.celcius,
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
