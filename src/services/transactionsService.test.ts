import {
  getTransactionById,
  getTransactionsByAccNo,
  createTransaction,
} from "@/services/transactionsService";
import { db } from "@/db";
import { TransactionStatus, ExpenseCategory } from "@/shared/types";
import { eq, or, desc, sql } from "drizzle-orm";

jest.mock("@/db", () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock("crypto", () => ({
  randomUUID: jest.fn(() => "mock-uuid-1234"),
}));

describe("TransactionsService", () => {
  const mockTransaction = {
    id: "550e8400-e29b-41d4-a716-446655440030",
    amount: -2500.0,
    timestamp: new Date("2025-02-05T10:30:00"),
    accountSrcNo: "160-0000012345678-91",
    accountDestNo: "170-0000099999999-22",
    description: "Kirija za stan",
    status: "Izvršena",
    category: "Stanovanje",
    currencyID: "550e8400-e29b-41d4-a716-446655440001",
  };

  const mockTransactions = [
    mockTransaction,
    {
      id: "550e8400-e29b-41d4-a716-446655440031",
      amount: -1200.0,
      timestamp: new Date("2025-02-04T14:15:00"),
      accountSrcNo: "160-0000012345678-91",
      accountDestNo: "180-0000055555555-33",
      description: "Kupovina",
      status: "Izvršena",
      category: "Hrana",
      currencyID: "550e8400-e29b-41d4-a716-446655440001",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTransactionById", () => {
    it("should return transaction when it exists", async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockTransaction]),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);

      const result = await getTransactionById(
        "550e8400-e29b-41d4-a716-446655440030",
      );

      expect(result).toEqual(mockTransaction);
    });

    it("should return null when transaction does not exist", async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };

      (db.select as jest.Mock).mockReturnValue(mockSelect);

      const result = await getTransactionById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("getTransactionsByAccNo", () => {
    it("should return null when accNo is null", async () => {
      const result = await getTransactionsByAccNo(null);

      expect(result).toBeNull();
      expect(db.select).not.toHaveBeenCalled();
    });

    it("should return null when account does not exist", async () => {
      const mockAccountSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };

      (db.select as jest.Mock).mockReturnValue(mockAccountSelect);

      const result = await getTransactionsByAccNo("160-0000099999999-99");

      expect(result).toBeNull();
    });

    it("should return transactions for valid account number", async () => {
      const mockAccount = { accountNo: "160-0000012345678-91" };

      let callCount = 0;
      (db.select as jest.Mock).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockResolvedValue([mockAccount]),
          };
        } else {
          return {
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockResolvedValue(mockTransactions),
          };
        }
      });

      const result = await getTransactionsByAccNo("160-0000012345678-91");

      expect(result).toEqual(mockTransactions);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when account exists but has no transactions", async () => {
      const mockAccount = { accountNo: "160-0000012345678-91" };

      let callCount = 0;
      (db.select as jest.Mock).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockResolvedValue([mockAccount]),
          };
        } else {
          return {
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockResolvedValue([]),
          };
        }
      });

      const result = await getTransactionsByAccNo("160-0000012345678-91");

      expect(result).toEqual([]);
    });
  });

  describe("createTransaction", () => {
    const validTransactionData = {
      accountSrcNo: "160-0000012345678-91",
      accountDestNo: "170-0000099999999-22",
      amount: -2500.0,
      description: "Test payment",
      category: ExpenseCategory.HOUSING,
      currencyID: "550e8400-e29b-41d4-a716-446655440001",
      status: TransactionStatus.EXECUTED,
      timestamp: new Date(),
    };

    it("should create transaction and update balances successfully", async () => {
      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([mockTransaction]),
      };

      const mockUpdate = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue({}),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);
      (db.update as jest.Mock).mockReturnValue(mockUpdate);

      const result = await createTransaction(validTransactionData);

      expect(result).toEqual(mockTransaction);
      expect(db.insert).toHaveBeenCalled();
      expect(db.update).toHaveBeenCalledTimes(2);
    });

    it("should return null on database error", async () => {
      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockRejectedValue(new Error("Database error")),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const result = await createTransaction(validTransactionData);

      expect(result).toBeNull();
    });

    it("should handle null description and category", async () => {
      const dataWithNulls = {
        ...validTransactionData,
        description: null,
        category: null,
      };

      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest
          .fn()
          .mockResolvedValue([
            { ...mockTransaction, description: null, category: null },
          ]),
      };

      const mockUpdate = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue({}),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);
      (db.update as jest.Mock).mockReturnValue(mockUpdate);

      const result = await createTransaction(dataWithNulls);

      expect(result).toBeDefined();
      expect(result?.description).toBeNull();
      expect(result?.category).toBeNull();
    });

    it("should update source account balance correctly", async () => {
      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([mockTransaction]),
      };

      const mockUpdate = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue({}),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);
      (db.update as jest.Mock).mockReturnValue(mockUpdate);

      await createTransaction(validTransactionData);

      expect(db.update).toHaveBeenCalledTimes(2);
      expect(mockUpdate.where).toHaveBeenCalledTimes(2);
    });
  });
});
