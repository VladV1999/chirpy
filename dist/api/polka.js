import { updateChirpyRed } from "../db/queries/users.js";
import { respondWithError, respondWithJSON } from "./json.js";
export async function handlerPolka(req, res) {
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
