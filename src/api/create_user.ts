import { Request, Response } from "express";
import { hashPassword } from "../auth/auth.js";
import { createUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";

export type UserResponse = {
    id: string,
    createdAt: Date,
    updatedAt: Date,
    email: string,
    token: string,
    refreshToken: string,
}
export async function handlerCreateUser(req: Request, res: Response): Promise<void> {
    if (req.body.email === undefined) {
        throw new Error("There is no email field, please include an email field!");
    }
    if (req.body.password === undefined) {
        throw new Error("There is no password field, please include a password!");
    }
    const email: string = req.body.email;
    const password: string = req.body.password;
    const hashedPassword: string = await hashPassword(password);
    
    const userRes = await createUser({ email, hashedPassword });
    respondWithJSON(res, 201, {
        id: `${userRes.id}`,
        email: `${userRes.email}`,
        createdAt: `${userRes.createdAt}`,
        updatedAt: `${userRes.updatedAt}`,
    });
}