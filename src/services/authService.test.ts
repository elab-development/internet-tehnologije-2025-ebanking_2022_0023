import { login } from "@/services/authService";
import { db } from "@/db";
import { users } from "@/db/schema";
import { compare } from "bcrypt";
import { eq } from "drizzle-orm";

jest.mock("@/db", () => ({
  db: {
    select: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

describe("AuthService", () => {
  const mockUser = {
    id: "550e8400-e29b-41d4-a716-446655440012",
    email: "marko.petrovic@email.com",
    password: "$2b$10$hashedpassword",
    firstName: "Marko",
    lastName: "Petrović",
    phone: "+381641234567",
    nationalId: "1234567890123",
    dateOfBirth: new Date("1990-05-15"),
    sex: "Muški",
    role: "CLIENT",
    active: true,
    createdAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should return user when email and password are correct", async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockUser]),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);
      (compare as jest.Mock).mockResolvedValue(true);

      const result = await login("marko.petrovic@email.com", "test123");

      expect(result).toEqual(mockUser);
      expect(db.select).toHaveBeenCalled();
      expect(compare).toHaveBeenCalledWith("test123", mockUser.password);
    });

    it("should return null when user does not exist", async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);

      const result = await login("nonexistent@email.com", "password");

      expect(result).toBeNull();
      expect(compare).not.toHaveBeenCalled();
    });

    it("should return null when password is incorrect", async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockUser]),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);
      (compare as jest.Mock).mockResolvedValue(false);

      const result = await login("marko.petrovic@email.com", "wrongpassword");

      expect(result).toBeNull();
      expect(compare).toHaveBeenCalledWith("wrongpassword", mockUser.password);
    });

    it("should return null when user is inactive", async () => {
      const inactiveUser = { ...mockUser, active: false };
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([inactiveUser]),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);
      (compare as jest.Mock).mockResolvedValue(true);

      const result = await login("marko.petrovic@email.com", "test123");

      expect(result).toBeNull();
    });

    it("should handle database errors gracefully", async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockRejectedValue(new Error("Database error")),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);

      await expect(login("test@email.com", "password")).rejects.toThrow(
        "Database error",
      );
    });
  });
});
