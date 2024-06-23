import { Collection, ObjectId } from "mongodb";
import { RespiratoryRate } from "../../core/entities/RespiratoryRate";
import { IRespiratoryRateRepository } from "../../core/repositories/IRespiratoryRateRepository";

export class RespiratoryRateRepository implements IRespiratoryRateRepository {
    constructor(private collection: Collection) {}

    async getAll(userId: string): Promise<RespiratoryRate[]> {
        const pipeline = [
            {
                $match: {
                    name: "RESPIRATORY_RATE",
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
                    breathsPerMinute: 1,
                },
            },
        ];

        const result = await this.collection.aggregate(pipeline).toArray();
        return result.map(
            (r) =>
                new RespiratoryRate(
                    r.breathsPerMinute,
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
        breathsPerMinute: number
    ): Promise<RespiratoryRate> {
        const respiratoryRate = new RespiratoryRate(
            breathsPerMinute,
            userId,
            timeMeasured
        );
        const data = respiratoryRate.dataAsJson();
        const result = await this.collection.insertOne(data, {
            ignoreUndefined: true,
        });
        respiratoryRate.id = result.insertedId.toString();
        return respiratoryRate;
    }

    async update(
        id: string,
        timeMeasured?: Date | undefined,
        breathsPerMinute?: number | undefined
    ): Promise<RespiratoryRate> {
        const respiratoryRate = await this.collection.findOne({
            _id: new ObjectId(id),
        });

        if (!respiratoryRate) {
            throw new Error(
                "Id not found. Cannot update RespiratoryRate document"
            );
        }

        const newBreathsPerMinute =
            breathsPerMinute ?? respiratoryRate.breathsPerMinute;
        const newStatus = RespiratoryRate.calculateStatus(newBreathsPerMinute);
        const newTimeMeasured = timeMeasured ?? respiratoryRate.timeMeasured;

        await this.collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    timeMeasured: newTimeMeasured,
                    breathsPerMinute: newBreathsPerMinute,
                    status: newStatus,
                },
            },
            { ignoreUndefined: true }
        );

        return new RespiratoryRate(
            newBreathsPerMinute,
            respiratoryRate.userId,
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
