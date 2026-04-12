import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
export async function hashPassword(password) {
    try {
        const hash = await argon2.hash(password);
        return hash;
    }
    catch (err) {
        throw new Error(`There was a problem hashing the password`);
    }
}
export async function checkPasswordHash(password, hash) {
    try {
        if (await argon2.verify(hash, password)) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        throw new Error("Something went wrong trying to verify password");
    }
}
export function makeJWT(userID, expiresIn, secret) {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iss: "chirpy",
        sub: userID,
        iat: now,
        exp: now + expiresIn,
    };
    const token = jwt.sign(payload, secret);
    return token;
}
export function validateJWT(tokenString, secret) {
    let result = "";
    try {
        result = jwt.verify(tokenString, secret);
    }
    catch (err) {
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
export function getBearerToken(req) {
    const header = req.get('Authorization');
    if (header === undefined) {
        throw new Error("There is no authorization header in this request!");
    }
    const tokenString = header.replace('Bearer ', '');
    return tokenString;
}
