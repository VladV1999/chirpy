import { getBearerToken, hashPassword, validateJWT } from "../auth/auth.js";
import { config } from "../config.js";
import { getUserById, updateUser } from "../db/queries/users.js";
import { respondWithError, respondWithJSON } from "./json.js";
export async function handlerResetCredentials(req, res) {
    let bearerToken;
    try {
        bearerToken = getBearerToken(req);
    }
    catch (err) {
        respondWithError(res, 401, "The access token is either malformed or missing");
        return;
    }
    if (req.body.email === undefined
        || req.body.password === undefined) {
        respondWithError(res, 400, "The password or email is missing in the body");
        return;
    }
    const pass = req.body.password;
    const email = req.body.email;
    const hashedPass = await hashPassword(pass);
    let id = "";
    try {
        id = validateJWT(bearerToken, config.api.secret);
    }
    catch (err) {
        respondWithError(res, 401, "Invalid or malformed token!");
        return;
    }
    const user = await getUserById(id);
    const updatedUser = await updateUser(id, email, hashedPass);
    const payload = {
        id: updatedUser.id,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
    };
    if (updatedUser === undefined) {
        respondWithError(res, 400, "Something went wrong with updating the user");
    }
    respondWithJSON(res, 200, payload);
}
