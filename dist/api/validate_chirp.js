import { respondWithError, respondWithJSON } from "./json.js";
export async function handlerChirpsValidate(req, res) {
    const params = req.body;
    const maxLength = 140;
    if (params.body.length > maxLength) {
        respondWithError(res, 400, "Chirp is too long");
        return;
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
