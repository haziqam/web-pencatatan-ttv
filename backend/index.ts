import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { BloodPressure } from "./core/entities/BloodPressure";
import { MongoClient, ObjectId } from "mongodb";
import { groupCollapsed } from "console";

dotenv.config();

const app = express();
const port = process.env.EXPRESS_PORT || 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, TypeScript with Express!");
});

app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);

    const mongoUri =
        process.env.CONN_STRING ||
        "mongodb://your_username:your_password@mongodb:27017";
    const dbName = process.env.DB_NAME || "TTV";

    const client = new MongoClient(mongoUri);
    console.log(`client: ${client}`);
    await client.connect();
    const db = client.db(dbName);
    console.log(`db: ${db}`);
    const collection = db.collection("VitalSign");
    console.log(`collection: ${groupCollapsed}`);

    // const data = new BloodPressure(
    //     120,
    //     80,
    //     new Date(),
    //     "6677a8d5ae994f27468d1611"
    // ).dataAsJson();

    // data.userId = new ObjectId(data.userId as string);

    // const result = await collection.insertOne(data, {
    //     ignoreUndefined: true,
    // });

    // const pipeline = [
    //     {
    //         $match: {
    //             name: "BLOOD_PRESSURE", // Filter documents where name is "BLOOD_PRESSURE"
    //         },
    //     },
    //     {
    //         $project: {
    //             _id: 0, // Exclude the default _id field
    //             id: { $toString: "$_id" }, // Convert _id to string and rename to id
    //             userId: { $toString: "$userId" }, // Convert userId to string
    //             timeMeasured: 1, // Include timeMeasured
    //             status: 1, // Include status
    //             systole: 1, // Include systole
    //             diastole: 1, // Include diastole
    //         },
    //     },
    // ];

    // const result = await collection.aggregate(pipeline).toArray();

    // console.log("Result:", result);
});
