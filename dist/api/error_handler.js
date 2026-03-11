import { respondWithJSON } from "./json.js";
export function middlewareHandlerError(err, req, res, next) {
    console.error(err);
    respondWithJSON(res, 500, {
        "error": "Something went wrong on our end"
    });
}
