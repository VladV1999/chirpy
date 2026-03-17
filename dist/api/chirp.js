import { addChirp } from "../db/queries/chirps.js";
import { BadRequestError } from "./error.js";
import { respondWithJSON } from "./json.js";
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
    const chirp = await addChirp({ 'body': newBody,
        'userId': params.userId });
    respondWithJSON(res, 201, {
        "id": chirp.id,
        "createdAt": chirp.createdAt,
        "updatedAt": chirp.updatedAt,
        "body": chirp.body,
        "userId": chirp.userId,
    });
}
;
