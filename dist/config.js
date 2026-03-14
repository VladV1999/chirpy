process.loadEnvFile();
export function envOrThrow(key) {
    if (process.env[key] == undefined) {
        throw new Error("The environment variable is not set!");
    }
    return process.env[key];
}
export let config = {
    fileServerHits: 0,
    dbURL: envOrThrow("DB_URL"),
};
