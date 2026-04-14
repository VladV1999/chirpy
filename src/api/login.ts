import { Request, Response } from "express";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../auth/auth.js";
import { config } from "../config.js";
import { addRefreshToken } from "../db/queries/refresh_tokens.js";
import { userByEmail } from "../db/queries/users.js";
import type { UserResponse } from "./create_user.js";
import { respondWithError, respondWithJSON } from "./json.js";
export async function handlerLogin(req: Request, res: Response): Promise<void> {
    if (req.body.email === undefined) {
        throw new Error("To login, there must be an email, provide an email");
    }
    const email = req.body.email;
    if (req.body.password === undefined) {
        throw new Error("To login, there must be a password, provide a password");
    }
    const pass = req.body.password;
    let expiresInSeconds = 3600;
    const user = await userByEmail(email);
    if (user === undefined) {
        respondWithError(res, 401, "There is no such user in the database");
        return;
    }
    if (await checkPasswordHash(pass, user.hashedPassword) === false) {
        respondWithError(res, 401, "The passwords do not match, unauthorized entry");
        return;
    }
    const token = makeJWT(user.id, expiresInSeconds, config.api.secret);
    const refreshTokenString = makeRefreshToken();
    const expirationDateInDays = 60 * 24 * 60 * 60 * 1000;
    const refreshToken = {
        userId: user.id,
        token: refreshTokenString,
        expiresAt: new Date(Date.now() + expirationDateInDays),
        revokedAt: null,
    }
    const refreshDB = await addRefreshToken(refreshToken);
    const userRes: UserResponse = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: token,
        refreshToken: refreshDB.token,
    }
    respondWithJSON(res, 200, userRes);
}