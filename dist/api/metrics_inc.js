import { config } from "../config.js";
export function middlewareMetricsInc(req, res, next) {
    config.fileServerHits += 1;
    next();
}
