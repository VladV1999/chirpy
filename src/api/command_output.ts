import { Request, Response } from "express";
import { config } from "../config.js";

export function logRequests(req: Request, res: Response): void {
    res.send(`Hits: ${config.fileServerHits}`);
}

export function requestsReset(req: Request, res: Response): void {
    config.fileServerHits = 0;
    res.send(`Hits: ${config.fileServerHits}`);
}