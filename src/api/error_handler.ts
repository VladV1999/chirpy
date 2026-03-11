import { NextFunction, Request, Response } from "express";
import { respondWithJSON } from "./json.js";

export function middlewareHandlerError(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    respondWithJSON(res, 500, {
        "error": "Something went wrong on our end"
    })
}