import { Request, Response } from "express";
import { config } from "../config.js";
import { deleteAllUsers } from "../db/queries/users.js";

export function logRequests(req: Request, res: Response): void {
    res.send(`Hits: ${config.api.fileServerHits}`);
}

export async function requestsReset(req: Request, res: Response): Promise<void> {
    if (config.api.platform !== "dev") {
        res.status(403).send();
        return;
    }
    await deleteAllUsers();
    res.status(200).send();
}

export function adminLogRequests(req: Request, res: Response): void {
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