import { BloodPressure } from "../../core/entities/BloodPressure";
import { IBloodPressureRepository } from "../../core/repositories/IBloodPressureRepository";
import { Collection, ObjectId } from "mongodb";

export class BloodPressureRepository implements IBloodPressureRepository {
    constructor(private collection: Collection) {}

    async getAll(userId: string): Promise<BloodPressure[]> {
        const pipeline = [
            {
                $match: {
                    name: "BLOOD_PRESSURE",
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
                    systole: 1,
                    diastole: 1,
                },
            },
        ];

        const result = await this.collection.aggregate(pipeline).toArray();
        return result.map(
            (r) =>
                new BloodPressure(
                    r.systole,
                    r.diastole,
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
        systole: number,
        diastole: number
    ): Promise<BloodPressure> {
        const bloodPressure = new BloodPressure(
            systole,
            diastole,
            userId,
            timeMeasured
        );
        const data = bloodPressure.dataAsJson();
        const result = await this.collection.insertOne(data, {
            ignoreUndefined: true,
        });
        bloodPressure.id = result.insertedId.toString();
        return bloodPressure;
    }

    async update(
        id: string,
        timeMeasured?: Date | undefined,
        systole?: number | undefined,
        diastole?: number | undefined
    ): Promise<BloodPressure> {
        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { timeMeasured, systole, diastole } },
            { ignoreUndefined: true, returnDocument: "after" }
        );

        if (!result) {
            throw new Error(
                "Id not found. Cannot update BloodPressure document"
            );
        }

        return new BloodPressure(
            result.systole,
            result.diastole,
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
