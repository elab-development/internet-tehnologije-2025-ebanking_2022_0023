import {
  generateJwt,
  verifyJwt,
  getUserId,
  getUserRole,
  JwtPayload,
} from "@/lib/jwt";

describe("JWT Utils", () => {
  const validPayload: JwtPayload = {
    userId: "550e8400-e29b-41d4-a716-446655440012",
    userRole: "CLIENT",
  };

  describe("generateJwt", () => {
    it("should generate a valid JWT token", () => {
      const token = generateJwt(validPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);
    });

    it("should generate different tokens for different payloads", () => {
      const token1 = generateJwt(validPayload);
      const token2 = generateJwt({ userId: "different-id", userRole: "ADMIN" });

      expect(token1).not.toBe(token2);
    });
  });

  describe("verifyJwt", () => {
    it("should return true for a valid token", () => {
      const token = generateJwt(validPayload);
      const isValid = verifyJwt(token);

      expect(isValid).toBe(true);
    });

    it("should return false for an invalid token", () => {
      const isValid = verifyJwt("invalid.token.here");

      expect(isValid).toBe(false);
    });

    it("should return false for a tampered token", () => {
      const token = generateJwt(validPayload);
      const tamperedToken = token.slice(0, -5) + "xxxxx";
      const isValid = verifyJwt(tamperedToken);

      expect(isValid).toBe(false);
    });

    it("should return false for an empty token", () => {
      const isValid = verifyJwt("");

      expect(isValid).toBe(false);
    });
  });

  describe("getUserId", () => {
    it("should extract userId from a valid token", () => {
      const token = generateJwt(validPayload);
      const userId = getUserId(token);

      expect(userId).toBe(validPayload.userId);
    });

    it("should throw error for an invalid token", () => {
      expect(() => {
        getUserId("invalid.token.here");
      }).toThrow();
    });
  });

  describe("getUserRole", () => {
    it("should extract userRole from a valid token", () => {
      const token = generateJwt(validPayload);
      const userRole = getUserRole(token);

      expect(userRole).toBe(validPayload.userRole);
    });

    it("should extract ADMIN role correctly", () => {
      const adminPayload: JwtPayload = {
        userId: "admin-id",
        userRole: "ADMIN",
      };
      const token = generateJwt(adminPayload);
      const userRole = getUserRole(token);

      expect(userRole).toBe("ADMIN");
    });

    it("should extract MANAGER role correctly", () => {
      const managerPayload: JwtPayload = {
        userId: "manager-id",
        userRole: "MANAGER",
      };
      const token = generateJwt(managerPayload);
      const userRole = getUserRole(token);

      expect(userRole).toBe("MANAGER");
    });

    it("should throw error for an invalid token", () => {
      expect(() => {
        getUserRole("invalid.token.here");
      }).toThrow();
    });
  });
});
