import * as argon2 from "argon2";
import { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
export async function hashPassword(password: string): Promise<string> {
    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (err) {
        throw new Error(`There was a problem hashing the password`);
    }
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    try {
        if (await argon2.verify(hash, password)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        throw new Error("Something went wrong trying to verify password");
    }
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const now = Math.floor(Date.now() / 1000);
    const payload: payload = {
        iss: "chirpy",
        sub: userID,
        iat: now,
        exp: now + expiresIn,
    }
    const token = jwt.sign(payload, secret);
    return token;
}

export function validateJWT(tokenString: string, secret: string): string {
    let result: string | JwtPayload = "";
    try {
        result = jwt.verify(tokenString, secret);
    } catch (err) {
        throw new Error("The token is invalid!");
    }
    if (typeof result === "string") {
        throw new Error("Something unexpected happened, the payload is a string!");
    }
    if (result.sub === undefined) {
        throw new Error("The user's id is undefined!");
    }
    return result.sub;
}

export function getBearerToken(req: Request): string {
    const header = req.get('Authorization');
    if (header === undefined) {
        throw new Error("There is no authorization header in this request!");
    }
    const tokenString = header.replace('Bearer ', '');
    return tokenString;
}