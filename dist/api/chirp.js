import { getBearerToken, validateJWT } from "../auth/auth.js";
import { config } from "../config.js";
import { addChirp, getChirpByAuthorId, getChirpById, getChirps } from "../db/queries/chirps.js";
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
    let authorId = "";
    let authorIdQuery = req.query.authorId;
    if (typeof authorIdQuery === "string") {
        authorId = authorIdQuery;
    }
    let sortType = "asc";
    if (req.query.sort !== undefined &&
        typeof req.query.sort === "string" &&
        req.query.sort === "desc") {
        sortType = "desc";
    }
    let sortedChirps;
    if (authorId !== "") {
        const chirps = await getChirpByAuthorId(authorId);
        sortedChirps = sortChirps(chirps, sortType);
        respondWithJSON(res, 200, sortedChirps);
        return;
    }
    const chirps = await getChirps();
    sortedChirps = sortChirps(chirps, sortType);
    respondWithJSON(res, 200, sortedChirps);
}
function sortChirps(chirps, sortType = "asc") {
    let sortedChirps;
    if (sortType === "asc") {
        sortedChirps = chirps.toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        return sortedChirps;
    }
    else if (sortType === "desc") {
        sortedChirps = chirps.toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return sortedChirps;
    }
    else {
        return chirps;
    }
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
