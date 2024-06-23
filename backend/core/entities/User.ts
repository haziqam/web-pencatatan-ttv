import { Json } from "./Json";

export class User {
    constructor(
        private readonly _id: string,
        private _email: string,
        private _hashedPassword: string,
        private firstName: string,
        private lastName: string,
        private dateOfBirth: Date,
        private sex: Sex
    ) {}

    get id(): string {
        return this._id;
    }

    get email(): string {
        return this._email;
    }

    get hashedPassword(): string {
        return this._hashedPassword;
    }

    dataAsJson(): Json {
        return {
            id: this.id,
            email: this.email,
            hashedPassword: this.hashedPassword,
            firstName: this.firstName,
            lastName: this.lastName,
            dateOfBirth: this.dateOfBirth,
            sex: this.sex,
        };
    }

    publicDataAsJson(): Json {
        return {
            id: this.id,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            dateOfBirth: this.dateOfBirth,
            sex: this.sex,
        };
    }
}

export enum Sex {
    MALE = "MALE",
    FEMALE = "FEMALE",
}
