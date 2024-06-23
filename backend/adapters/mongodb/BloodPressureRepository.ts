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
        const bloodPressure = await this.collection.findOne({
            _id: new ObjectId(id),
        });

        if (!bloodPressure) {
            throw new Error(
                "Id not found. Cannot update BloodPressure document"
            );
        }

        const newSystole = systole ?? bloodPressure.systole;
        const newDiastole = diastole ?? bloodPressure.diastole;
        const newStatus = BloodPressure.calculateStatus(
            newSystole,
            newDiastole
        );
        const newTimeMeasured = timeMeasured ?? bloodPressure.timeMeasured;

        await this.collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    timeMeasured: newTimeMeasured,
                    systole: newSystole,
                    diastole: newDiastole,
                    status: newStatus,
                },
            },
            { ignoreUndefined: true }
        );

        return new BloodPressure(
            newSystole,
            newDiastole,
            bloodPressure.userId,
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
