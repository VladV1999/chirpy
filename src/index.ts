import express from "express";
import { middlewareLogResponses } from "./api/log_responses.js";
import { handlerReadiness } from "./api/readiness.js";
const app = express();
const PORT = 8080;

app.get("/healthz", handlerReadiness);
app.use(middlewareLogResponses);
app.use("/app",  express.static("./src/app"));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});