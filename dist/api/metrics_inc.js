import { config } from "../config.js";
export function middlewareMetricsInc(req, res, next) {
    config.api.fileServerHits += 1;
    next();
}
