import { Request, Response } from "express";
import { BadRequestError } from "./error.js";
import { respondWithJSON } from "./json.js";
export async function handlerChirpsValidate(req: Request, res: Response) {
    type parameters = {
    body: string;
    };

    const params: parameters = req.body;
    const maxLength = 140;
    if (params.body.length > maxLength) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    const splitBody = params.body.split(' ');
    for (let i = 0; i < splitBody.length; i++) {
        if (badWords.includes(splitBody[i].toLowerCase())) {
            splitBody[i] = "****"
        }
    }
    const newBody = splitBody.join(' ');
    respondWithJSON(res, 200, {
        cleanedBody: newBody,
  });
}
