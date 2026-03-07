import { GET, POST } from "@/app/api/transactions/route";
import {
  getTransactionsByAccNo,
  createTransaction,
} from "@/services/transactionsService";
import { verifyJwt } from "@/lib/jwt";
import { NextRequest } from "next/server";
import { TransactionStatus, ExpenseCategory } from "@/shared/types";

jest.mock("@/services/transactionsService");
jest.mock("@/lib/jwt");

describe("GET /api/transactions", () => {
  const mockTransactions = [
    {
      id: "550e8400-e29b-41d4-a716-446655440030",
      amount: -2500.0,
      timestamp: "2025-02-05T09:30:00.000Z",
      accountSrcNo: "160-0000012345678-91",
      accountDestNo: "170-0000099999999-22",
      description: "Kirija",
      status: "Izvršena",
      category: "Stanovanje",
      currencyID: "550e8400-e29b-41d4-a716-446655440001",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 when no authorization header", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/transactions?accNo=160-0000012345678-91",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it("should return 401 when JWT is invalid", async () => {
    (verifyJwt as jest.Mock).mockReturnValue(false);

    const request = new NextRequest(
      "http://localhost:3000/api/transactions?accNo=160-0000012345678-91",
      {
        headers: {
          authorization: "Bearer invalid-token",
        },
      },
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it("should return 200 with transactions for valid request", async () => {
    (verifyJwt as jest.Mock).mockReturnValue(true);
    (getTransactionsByAccNo as jest.Mock).mockResolvedValue(mockTransactions);

    const request = new NextRequest(
      "http://localhost:3000/api/transactions?accNo=160-0000012345678-91",
      {
        headers: {
          authorization: "Bearer valid-token",
        },
      },
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.transactions).toEqual(mockTransactions);
  });

  it("should return 400 when account not found", async () => {
    (verifyJwt as jest.Mock).mockReturnValue(true);
    (getTransactionsByAccNo as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest(
      "http://localhost:3000/api/transactions?accNo=999-9999999999999-99",
      {
        headers: {
          authorization: "Bearer valid-token",
        },
      },
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});

describe("POST /api/transactions", () => {
  const validTransactionData = {
    accountSrcNo: "160-0000012345678-91",
    accountDestNo: "170-0000099999999-22",
    amount: 2500,
    description: "Test payment",
    category: ExpenseCategory.HOUSING,
    currencyID: "550e8400-e29b-41d4-a716-446655440001",
  };

  const createdTransaction = {
    id: "new-transaction-id",
    ...validTransactionData,
    amount: -2500,
    status: TransactionStatus.EXECUTED,
    timestamp: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 when no authorization header", async () => {
    const request = new NextRequest("http://localhost:3000/api/transactions", {
      method: "POST",
      body: JSON.stringify(validTransactionData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Unauthorized");
  });

  it("should return 401 when JWT is invalid", async () => {
    (verifyJwt as jest.Mock).mockReturnValue(false);

    const request = new NextRequest("http://localhost:3000/api/transactions", {
      method: "POST",
      headers: {
        authorization: "Bearer invalid-token",
      },
      body: JSON.stringify(validTransactionData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Invalid token");
  });

  it("should return 400 when required fields are missing", async () => {
    (verifyJwt as jest.Mock).mockReturnValue(true);

    const incompleteData = {
      accountSrcNo: "160-0000012345678-91",
      amount: 2500,
    };

    const request = new NextRequest("http://localhost:3000/api/transactions", {
      method: "POST",
      headers: {
        authorization: "Bearer valid-token",
      },
      body: JSON.stringify(incompleteData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Missing required fields");
  });

  it("should return 201 and create transaction successfully", async () => {
    (verifyJwt as jest.Mock).mockReturnValue(true);
    (createTransaction as jest.Mock).mockResolvedValue(createdTransaction);

    const request = new NextRequest("http://localhost:3000/api/transactions", {
      method: "POST",
      headers: {
        authorization: "Bearer valid-token",
      },
      body: JSON.stringify(validTransactionData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.transaction).toEqual(createdTransaction);
  });

  it("should convert amount to negative value", async () => {
    (verifyJwt as jest.Mock).mockReturnValue(true);
    (createTransaction as jest.Mock).mockResolvedValue(createdTransaction);

    const request = new NextRequest("http://localhost:3000/api/transactions", {
      method: "POST",
      headers: {
        authorization: "Bearer valid-token",
      },
      body: JSON.stringify(validTransactionData),
    });

    await POST(request);

    expect(createTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: -2500,
      }),
    );
  });

  it("should return 500 when transaction creation fails", async () => {
    (verifyJwt as jest.Mock).mockReturnValue(true);
    (createTransaction as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest("http://localhost:3000/api/transactions", {
      method: "POST",
      headers: {
        authorization: "Bearer valid-token",
      },
      body: JSON.stringify(validTransactionData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Failed to create transaction");
  });

  it("should handle null description and category", async () => {
    (verifyJwt as jest.Mock).mockReturnValue(true);
    (createTransaction as jest.Mock).mockResolvedValue(createdTransaction);

    const dataWithNulls = {
      ...validTransactionData,
      description: null,
      category: null,
    };

    const request = new NextRequest("http://localhost:3000/api/transactions", {
      method: "POST",
      headers: {
        authorization: "Bearer valid-token",
      },
      body: JSON.stringify(dataWithNulls),
    });

    await POST(request);

    expect(createTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        description: null,
        category: null,
      }),
    );
  });
});
