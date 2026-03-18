import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";

export async function addChirp(chirp: NewChirp) {
    const [result] = await db.insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
    return result;
}

export async function getChirps() {
    const data = await db.select().from(chirps);
    return data;
}