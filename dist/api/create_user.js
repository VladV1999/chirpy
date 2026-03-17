import { createUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
export async function handlerCreateUser(req, res) {
    if (req.body.email === undefined) {
        throw new Error("There is no email field, please include an email field");
    }
    const email = req.body.email;
    const user = await createUser({ email });
    respondWithJSON(res, 201, {
        id: `${user.id}`,
        email: `${user.email}`,
        createdAt: `${user.createdAt}`,
        updatedAt: `${user.updatedAt}`,
    });
}
