import { Request } from "express";
import { UserIdentifier } from "../schema/UserIdentifier";

export interface RequestWithIdentifier extends Request {
    userIdentifier?: UserIdentifier;
}
