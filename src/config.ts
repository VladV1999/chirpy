import type { MigrationConfig } from "drizzle-orm/migrator";
process.loadEnvFile();

export const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations"
}

export type APIConfig = {
    fileServerHits: number,
    port: number;
};

export type DBConfig = {
    url: string,
    migrationConfig: MigrationConfig
}

export function envOrThrow(key: string) {
    if (process.env[key] == undefined) {
        throw new Error("The environment variable is not set!");
    }
    return process.env[key]!;
}

export type Config = {
    api: APIConfig,
    db: DBConfig,
}

export const config: Config = {
    api: {
        fileServerHits: 0,
        port: Number(envOrThrow("PORT")),
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig
    }
}