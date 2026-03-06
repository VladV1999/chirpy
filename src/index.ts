import express from "express";
import { logRequests, requestsReset } from "./api/command_output.js";
import { middlewareLogResponses } from "./api/log_responses.js";
import { middlewareMetricsInc } from "./api/metrics_inc.js";
import { handlerReadiness } from "./api/readiness.js";
const app = express();
const PORT = 8080;
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/healthz", handlerReadiness);
app.get("/metrics", logRequests);
app.get("/reset", requestsReset);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});