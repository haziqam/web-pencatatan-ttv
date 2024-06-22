export class User {
    constructor(
        private id: string,
        private firstName: string,
        private email: string,
        private hashedPassword: string,
        private dateOfBirth: Date,
        private sex: Sex
    ) {}
}

enum Sex {
    MALE = "MALE",
    FEMALE = "FEMALE",
}
