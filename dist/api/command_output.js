import { config } from "../config.js";
export function logRequests(req, res) {
    res.send(`Hits: ${config.fileServerHits}`);
}
export function requestsReset(req, res) {
    config.fileServerHits = 0;
    res.send(`Hits: ${config.fileServerHits}`);
}
