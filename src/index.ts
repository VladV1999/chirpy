import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import express, { NextFunction, Request, Response } from "express";
import postgres from "postgres";
import { adminLogRequests, requestsReset } from "./api/command_output.js";
import { middlewareHandlerError } from "./api/error.js";
import { middlewareLogResponses } from "./api/log_responses.js";
import { middlewareMetricsInc } from "./api/metrics_inc.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerChirpsValidate } from "./api/validate_chirp.js";
import { config } from "./config.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);
const app = express();
const PORT = 8080;
app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", adminLogRequests);
app.post("/admin/reset", requestsReset);
app.post("/api/validate_chirp", async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await handlerChirpsValidate(req, res);
    } catch (err) {
        next(err);
    }
});
app.use(middlewareHandlerError);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});