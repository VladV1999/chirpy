import { getBearerToken, validateJWT } from "../auth/auth.js";
import { config } from "../config.js";
import { addChirp, getChirpById, getChirps } from "../db/queries/chirps.js";
import { BadRequestError } from "./error.js";
import { respondWithError, respondWithJSON } from "./json.js";
export async function handlerChirpsAdd(req, res) {
    const params = req.body;
    const maxLength = 140;
    if (params.body.length > maxLength) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    const splitBody = params.body.split(' ');
    for (let i = 0; i < splitBody.length; i++) {
        if (badWords.includes(splitBody[i].toLowerCase())) {
            splitBody[i] = "****";
        }
    }
    const newBody = splitBody.join(' ');
    try {
        const tokenString = getBearerToken(req);
        const userId = validateJWT(tokenString, config.api.secret);
        const chirp = await addChirp({ 'body': newBody,
            'userId': userId });
        respondWithJSON(res, 201, {
            "id": chirp.id,
            "createdAt": chirp.createdAt,
            "updatedAt": chirp.updatedAt,
            "body": chirp.body,
            "userId": chirp.userId,
        });
    }
    catch (err) {
        respondWithError(res, 401, "Unauthorized entry/malformed token");
    }
}
;
export async function handlerDisplayAllChirps(req, res) {
    const chirps = await getChirps();
    respondWithJSON(res, 200, chirps);
}
export async function handlerDisplayChirp(req, res) {
    const params = req.params.chirpId;
    const chirp = await getChirpById(params);
    if (chirp === undefined) {
        res.status(404).send();
        return;
    }
    respondWithJSON(res, 200, chirp);
}
