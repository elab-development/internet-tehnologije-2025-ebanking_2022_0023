import { POST } from "@/app/api/auth/login/route";
import { login } from "@/services/authService";
import { generateJwt } from "@/lib/jwt";
import { NextRequest } from "next/server";

jest.mock("@/services/authService");
jest.mock("@/lib/jwt");

describe("POST /api/auth/login", () => {
  const mockUser = {
    id: "550e8400-e29b-41d4-a716-446655440012",
    email: "marko.petrovic@email.com",
    password: "$2b$10$hashedpassword",
    firstName: "Marko",
    lastName: "Petrović",
    phone: "+381641234567",
    nationalId: "1234567890123",
    dateOfBirth: "1990-05-15T00:00:00.000Z",
    sex: "Muški",
    role: "CLIENT",
    active: true,
    createdAt: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and JWT token for valid credentials", async () => {
    (login as jest.Mock).mockResolvedValue(mockUser);
    (generateJwt as jest.Mock).mockReturnValue("mock-jwt-token");

    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "marko.petrovic@email.com",
        password: "test123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.jwt).toBe("mock-jwt-token");
    expect(data.user).toEqual({
      id: mockUser.id,
      role: mockUser.role,
      email: mockUser.email,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      phone: mockUser.phone,
      nationalId: mockUser.nationalId,
      dateOfBirth: mockUser.dateOfBirth,
      sex: mockUser.sex,
    });
    expect(data.user.password).toBeUndefined();
  });

  it("should return 400 for invalid credentials", async () => {
    (login as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "wrong@email.com",
        password: "wrongpassword",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.jwt).toBeUndefined();
  });

  it("should not expose password in response", async () => {
    (login as jest.Mock).mockResolvedValue(mockUser);
    (generateJwt as jest.Mock).mockReturnValue("mock-jwt-token");

    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "marko.petrovic@email.com",
        password: "test123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.user.password).toBeUndefined();
    expect(data.user.email).toBe(mockUser.email);
  });

  it("should call generateJwt with correct payload", async () => {
    (login as jest.Mock).mockResolvedValue(mockUser);
    (generateJwt as jest.Mock).mockReturnValue("mock-jwt-token");

    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "marko.petrovic@email.com",
        password: "test123",
      }),
    });

    await POST(request);

    expect(generateJwt).toHaveBeenCalledWith({
      userId: mockUser.id,
      userRole: mockUser.role,
    });
  });

  it("should handle missing email field", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        password: "test123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it("should handle missing password field", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@email.com",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});
