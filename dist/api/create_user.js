import { hashPassword } from "../auth/auth.js";
import { createUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
export async function handlerCreateUser(req, res) {
    if (req.body.email === undefined) {
        throw new Error("There is no email field, please include an email field!");
    }
    if (req.body.password === undefined) {
        throw new Error("There is no password field, please include a password!");
    }
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await hashPassword(password);
    const userRes = await createUser({ email, hashedPassword });
    respondWithJSON(res, 201, {
        id: `${userRes.id}`,
        email: `${userRes.email}`,
        createdAt: `${userRes.createdAt}`,
        updatedAt: `${userRes.updatedAt}`,
    });
}
