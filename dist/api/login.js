import { checkPasswordHash, makeJWT } from "../auth/auth.js";
import { config } from "../config.js";
import { userByEmail } from "../db/queries/users.js";
import { respondWithError, respondWithJSON } from "./json.js";
export async function handlerLogin(req, res) {
    if (req.body.email === undefined) {
        throw new Error("To login, there must be an email, provide an email");
    }
    const email = req.body.email;
    if (req.body.password === undefined) {
        throw new Error("To login, there must be a password, provide a password");
    }
    const pass = req.body.password;
    let expiresInSeconds;
    if (req.body.expiresInSeconds === undefined) {
        expiresInSeconds = 3600;
    }
    else if (req.body.expiresInSeconds > 3600) {
        expiresInSeconds = 3600;
    }
    else {
        expiresInSeconds = req.body.expiresInSeconds;
    }
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
    const userRes = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: token,
    };
    respondWithJSON(res, 200, userRes);
}
