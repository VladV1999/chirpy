import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps } from "../schema.js";
export async function addChirp(chirp) {
    const [result] = await db.insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function getChirps() {
    const result = await db.select().from(chirps).orderBy(chirps.createdAt);
    return result;
}
export async function getChirpById(id) {
    const [result] = await db.select().from(chirps).where(eq(chirps.id, id));
    return result;
}
