import { Collection, ObjectId } from "mongodb";
import { IUserRepository } from "../../core/repositories/IUserRepository";
import { Sex, User } from "../../core/entities/User";

export class UserRepository implements IUserRepository {
    constructor(private collection: Collection) {}

    async create(
        email: string,
        hashedPassword: string,
        firstName: string,
        lastName: string,
        dateOfBirth: Date,
        sex: Sex
    ): Promise<User> {
        const data = {
            email,
            hashedPassword,
            firstName,
            lastName,
            dateOfBirth,
            sex,
        };
        const result = await this.collection.insertOne(data, {
            ignoreUndefined: true,
        });

        return new User(
            result.insertedId.toString(),
            email,
            hashedPassword,
            firstName,
            lastName,
            dateOfBirth,
            sex
        );
    }

    async findById(id: string): Promise<User | null> {
        const result = await this.collection.findOne({ _id: new ObjectId(id) });
        if (!result) {
            return null;
        }

        return new User(
            result._id.toString(),
            result.email,
            result.hashedPassword,
            result.firstName,
            result.lastName,
            result.dateOfBirth,
            result.sex
        );
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await this.collection.findOne({ email });
        if (!result) {
            return null;
        }

        return new User(
            result._id.toString(),
            result.email,
            result.hashedPassword,
            result.firstName,
            result.lastName,
            result.dateOfBirth,
            result.sex
        );
    }

    async delete(id: string): Promise<void> {
        await this.collection.deleteOne({ _id: new ObjectId(id) });
    }
}
