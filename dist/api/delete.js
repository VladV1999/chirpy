import { getBearerToken, validateJWT } from "../auth/auth.js";
import { config } from "../config.js";
import { deleteChirp, getChirpById } from "../db/queries/chirps.js";
import { respondWithError } from "./json.js";
export async function handlerDeleteChirp(req, res) {
    let token;
    try {
        token = getBearerToken(req);
    }
    catch (err) {
        respondWithError(res, 401, "The token is malformed or missing!");
        return;
    }
    const chirpId = req.params.chirpId;
    if (chirpId === undefined) {
        respondWithError(res, 400, "The chirp id is missing!");
        return;
    }
    let id;
    try {
        id = validateJWT(token, config.api.secret);
    }
    catch (err) {
        respondWithError(res, 401, "Invalid or malformed token");
    }
    const chirp = await getChirpById(chirpId);
    if (chirp === undefined) {
        respondWithError(res, 404, "The chirp was not found in the database");
        return;
    }
    if (chirp.userId !== id) {
        respondWithError(res, 403, "This chirp does not belong to the said user");
        return;
    }
    const deletedChirp = await deleteChirp(chirp.id);
    if (deletedChirp === undefined) {
        respondWithError(res, 500, "Something went wrong with deleting the tweet");
        return;
    }
    res.status(204).send();
}
