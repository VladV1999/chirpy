import { respondWithJSON } from "./json.js";
export async function handlerChirpsValidate(req, res) {
    const params = req.body;
    const maxLength = 140;
    if (params.body.length > maxLength) {
        throw new Error(`Throwing error, length is currently more than
            max length allowed: ${maxLength}`);
    }
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    const splitBody = params.body.split(' ');
    for (let i = 0; i < splitBody.length; i++) {
        if (badWords.includes(splitBody[i].toLowerCase())) {
            splitBody[i] = "****";
        }
    }
    const newBody = splitBody.join(' ');
    respondWithJSON(res, 200, {
        cleanedBody: newBody,
    });
}
