import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewRefreshToken, refreshTokens, users } from "../schema.js";

export async function addRefreshToken(refreshToken: NewRefreshToken) {
    const [result] = await db
    .insert(refreshTokens)
    .values(refreshToken)
    .returning();
    return result;
}

export async function getRefreshToken(hexString: string) {
    const [result] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, hexString));
    return result;
}

export async function getUserFromRefreshToken(token: string) {
    const [result] = await db
    .select()
    .from(refreshTokens)
    .innerJoin(users, eq(refreshTokens.userId, users.id))
    .where(eq(refreshTokens.token, token));
    return result;
}

export async function revokeRefreshToken(token: string) {
    const [result] = await db
    .update(refreshTokens)
    .set({ revokedAt: new Date(Date.now()) })
    .where(eq(refreshTokens.token, token))
    .returning();
    return result;
}