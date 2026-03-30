import { checkPasswordHash } from "../auth/auth.js";
import { userByEmail } from "../db/queries/users.js";
import { respondWithError, respondWithJSON } from "./json.js";
export async function handlerLogin(req, res) {
    if (req.body.email === undefined) {
        throw new Error("To login, there must be an email, provide an email");
    }
    if (req.body.password === undefined) {
        throw new Error("To login, there must be a password, provide a password");
    }
    const email = req.body.email;
    const pass = req.body.password;
    const user = await userByEmail(email);
    const userRes = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
    };
    if (user === undefined) {
        respondWithError(res, 401, "There is no such user in the database");
    }
    if (await checkPasswordHash(pass, user.hashedPassword) === false) {
        respondWithError(res, 401, "The passwords do not match, unauthorized entry");
    }
    respondWithJSON(res, 200, userRes);
}
