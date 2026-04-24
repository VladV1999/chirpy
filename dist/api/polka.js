import { getAPIKey } from "../auth/auth.js";
import { config } from "../config.js";
import { updateChirpyRed } from "../db/queries/users.js";
import { UserNotAuthenticatedError } from "./error.js";
import { respondWithError, respondWithJSON } from "./json.js";
export async function handlerPolka(req, res) {
    const APIKey = await getAPIKey(req);
    if (APIKey === undefined) {
        throw new UserNotAuthenticatedError("The user is not authenticated with a key!");
    }
    if (APIKey !== config.api.polkaKey) {
        throw new UserNotAuthenticatedError("The API key provided is not authorized!");
    }
    const params = req.body;
    if (params.event !== "user.upgraded") {
        res.status(204).send();
        return;
    }
    const user = await updateChirpyRed(params.data.userId);
    if (user === undefined) {
        respondWithError(res, 404, "The user was not found in the database");
        return;
    }
    respondWithJSON(res, 204, "");
}
