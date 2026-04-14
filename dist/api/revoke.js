import { revokeRefreshToken } from "../db/queries/refresh_tokens.js";
import { respondWithError, respondWithJSON } from "./json.js";
export async function handlerRevoke(req, res) {
    const header = req.get('Authorization');
    if (header === undefined) {
        throw new Error("There is no authorization for the refresh");
    }
    const hexToken = header.replace('Bearer ', '');
    const token = await revokeRefreshToken(hexToken);
    if (token === undefined) {
        respondWithError(res, 401, "Something went wrong, either the \n\
            token was not found, or the revocation went wrong \n\
            or an unauthorized token was given");
        return;
    }
    respondWithJSON(res, 204, "Revocation successful");
}
