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
        const bodyTemperature = await this.collection.findOne({
            _id: new ObjectId(id),
        });

        if (!bodyTemperature) {
            throw new Error(
                "Id not found. Cannot update BodyTemperature document"
            );
        }

        const newCelcius = celcius ?? bodyTemperature.celcius;
        const newStatus = BodyTemperature.calculateStatus(newCelcius);
        const newTimeMeasured = timeMeasured ?? bodyTemperature.timeMeasured;

        await this.collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    timeMeasured: newTimeMeasured,
                    celcius: newCelcius,
                    status: newStatus,
                },
            },
            { ignoreUndefined: true }
        );

        return new BodyTemperature(
            newCelcius,
            bodyTemperature.userId,
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
