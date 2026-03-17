import { config } from "../config.js";
import { deleteAllUsers } from "../db/queries/users.js";
export function logRequests(req, res) {
    res.send(`Hits: ${config.api.fileServerHits}`);
}
export async function requestsReset(req, res) {
    if (config.api.platform !== "dev") {
        res.status(403).send();
        return;
    }
    await deleteAllUsers();
    res.status(200).send();
}
export function adminLogRequests(req, res) {
    res.set({
        'Content-Type': 'text/html; charset=utf-8',
    });
    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileServerHits} times!</p>
  </body>
</html>
`);
}
