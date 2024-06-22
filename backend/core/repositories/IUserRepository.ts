import { Sex, User } from "../entities/User";

export interface IUserRepository {
    create(
        firstName: string,
        lastName: string,
        dateOfBirth: Date,
        sex: Sex
    ): User;

    findById(id: string): User | null;

    findByEmail(email: string): User | null;

    update(user: User): User;

    delete(user: User): void;
}
