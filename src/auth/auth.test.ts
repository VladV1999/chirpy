import { beforeAll, describe, expect, it } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "./auth.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe("Password hashing improper", () => {
    const password1 = "incorrectPassword123!";
    const password2 = "incorrectPassword456!";
    let hash1: string;
    let hash2: string;

    beforeAll(async () => {
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(password2);
    })

    it("should return false for mixed passwords", async () => {
        const result = await checkPasswordHash(password1, hash2);
        expect(result).toBe(false);
    });
});

describe("Verification test for token", () => {
    const token = makeJWT("vlad", -1, "test-secret");

    it("Should return true for the verification", async () => {
        expect(() => validateJWT(token, "test-secret")).toThrow();
    });
});

describe("Verification test for invalid token", () => {
    const token = makeJWT("vlad", 100, "test-secret");

    it("Should return true for the verification", async () => {
        expect(() => validateJWT(token, "test-secretttttt")).toThrow("The token is invalid!");
    });
});