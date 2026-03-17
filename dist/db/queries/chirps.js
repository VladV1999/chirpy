import { db } from "../index.js";
import { chirps } from "../schema.js";
export async function addChirp(chirp) {
    const [result] = await db.insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}
