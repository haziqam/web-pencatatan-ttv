import { Sex, User } from "../entities/User";

export interface IUserRepository {
    create(
        email: string,
        hashedPassword: string,
        firstName: string,
        lastName: string,
        dateOfBirth: Date,
        sex: Sex
    ): Promise<User>;

    findById(id: string): Promise<User | null>;

    findByEmail(email: string): Promise<User | null>;

    delete(id: string): Promise<void>;
}
