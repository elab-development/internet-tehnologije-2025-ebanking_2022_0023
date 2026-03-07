import {
  getAccountById,
  getAccountsByClientId,
} from "@/services/accountsService";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";

jest.mock("@/db", () => ({
  db: {
    select: jest.fn(),
  },
}));

describe("AccountsService", () => {
  const mockAccount = {
    id: "550e8400-e29b-41d4-a716-446655440020",
    accountNo: "160-0000012345678-91",
    balance: "125430.50",
    createdAt: new Date("2020-01-10"),
    status: "Aktivan",
    clientID: "550e8400-e29b-41d4-a716-446655440012",
    currencyID: "550e8400-e29b-41d4-a716-446655440001",
  };

  const mockAccounts = [
    mockAccount,
    {
      id: "550e8400-e29b-41d4-a716-446655440021",
      accountNo: "160-0000087654321-15",
      balance: "3250.75",
      createdAt: new Date("2021-06-20"),
      status: "Aktivan",
      clientID: "550e8400-e29b-41d4-a716-446655440012",
      currencyID: "550e8400-e29b-41d4-a716-446655440002",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAccountById", () => {
    it("should return account with numeric balance when account exists", async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockAccount]),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);

      const result = await getAccountById(
        "550e8400-e29b-41d4-a716-446655440020",
      );

      expect(result).toEqual({
        ...mockAccount,
        balance: 125430.5,
      });
      expect(typeof result?.balance).toBe("number");
    });

    it("should return null when account does not exist", async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);

      const result = await getAccountById("non-existent-id");

      expect(result).toBeNull();
    });

    it("should convert string balance to number correctly", async () => {
      const accountWithDecimal = { ...mockAccount, balance: "1234.56" };
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([accountWithDecimal]),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);

      const result = await getAccountById("test-id");

      expect(result?.balance).toBe(1234.56);
      expect(typeof result?.balance).toBe("number");
    });
  });

  describe("getAccountsByClientId", () => {
    it("should return all accounts for a client with numeric balances", async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockAccounts),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);

      const result = await getAccountsByClientId(
        "550e8400-e29b-41d4-a716-446655440012",
      );

      expect(result).toHaveLength(2);
      expect(result[0].balance).toBe(125430.5);
      expect(result[1].balance).toBe(3250.75);
      expect(typeof result[0].balance).toBe("number");
      expect(typeof result[1].balance).toBe("number");
    });

    it("should return empty array when client has no accounts", async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);

      const result = await getAccountsByClientId("client-without-accounts");

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle single account correctly", async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockAccount]),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);

      const result = await getAccountsByClientId("test-client-id");

      expect(result).toHaveLength(1);
      expect(result[0].balance).toBe(125430.5);
    });

    it("should handle database errors", async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest
          .fn()
          .mockRejectedValue(new Error("Database connection failed")),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);

      await expect(getAccountsByClientId("test-id")).rejects.toThrow(
        "Database connection failed",
      );
    });
  });
});
