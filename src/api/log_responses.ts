import { NextFunction, Request, Response } from "express";
export async function middlewareLogResponses(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.on("finish", () => {
        const statusCode = res.statusCode;
        if (!(statusCode >= 200 &&
            statusCode < 300)
        ) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        }
    })
    next();
}