process.loadEnvFile();
export const migrationConfig = {
    migrationsFolder: "./src/db/migrations"
};
export function envOrThrow(key) {
    if (process.env[key] == undefined) {
        throw new Error("The environment variable is not set!");
    }
    return process.env[key];
}
export const config = {
    api: {
        fileServerHits: 0,
        port: Number(envOrThrow("PORT")),
        platform: envOrThrow("PLATFORM"),
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig
    }
};
