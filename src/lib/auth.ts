// lib/auth.ts  


import { getUserId, getUserRole, verifyJwt } from "@/lib/jwt";
import { UserRole } from "@/shared/types";

export async function getUserFromRequest(req: Request): Promise<{
  id: string;
  role: UserRole;
}> {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing token");
  }

  const token = authHeader.split(" ")[1];

  if (!verifyJwt(token)) {
    throw new Error("Invalid token");
  }

  return {
    id: getUserId(token),
    role: getUserRole(token),
  };
}
