import { respondWithError, respondWithJSON } from "./json.js";
export class BadRequestError extends Error {
    constructor(message) {
        super(message);
    }
}
export function middlewareHandlerError(err, req, res, next) {
    console.error(err);
    if (err instanceof BadRequestError) {
        respondWithError(res, 400, err.message);
    }
    else {
        respondWithJSON(res, 500, {
            "error": "Something went wrong on our end"
        });
    }
}
