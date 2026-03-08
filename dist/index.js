import express from "express";
import { adminLogRequests, requestsReset } from "./api/command_output.js";
import { middlewareLogResponses } from "./api/log_responses.js";
import { middlewareMetricsInc } from "./api/metrics_inc.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerChirpsValidate } from "./api/validate_chirp.js";
const app = express();
const PORT = 8080;
app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", adminLogRequests);
app.post("/admin/reset", requestsReset);
app.post("/api/validate_chirp", handlerChirpsValidate);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
