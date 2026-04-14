import { makeJWT } from "../auth/auth.js";
import { config } from "../config.js";
import { getUserFromRefreshToken } from "../db/queries/refresh_tokens.js";
import { respondWithError, respondWithJSON } from "./json.js";
export async function handlerRefresh(req, res) {
    const header = req.get('Authorization');
    if (header === undefined) {
        throw new Error("There is no authorization for the refresh");
    }
    const token = header.replace('Bearer ', '');
    const user = await getUserFromRefreshToken(token);
    if (user === undefined ||
        user.refresh_tokens.revokedAt !== null ||
        new Date(Date.now()) > user.refresh_tokens.expiresAt) {
        respondWithError(res, 401, "No refresh token found in the database, \n\
            it is expired, or revoked");
        return;
    }
    const expirationInSeconds = 3600;
    const JWT = makeJWT(user.users.id, expirationInSeconds, config.api.secret);
    respondWithJSON(res, 200, {
        token: JWT
    });
}
