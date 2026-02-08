import { UserRole } from "@/shared/types";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;
const EXPIRE = process.env.JWT_EXPIRE!;

export interface JwtPayload {
  userId: string;
  userRole: UserRole;
}

export function generateJwt(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRE });
}

export function verifyJwt(token: string): boolean {
  try {
    jwt.verify(token, SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Gets called after verifyJWT(), otherwise could throw unexpected error
 */
export function getUserRole(token: string): UserRole {
  const decoded = jwt.verify(token, SECRET) as JwtPayload;
  return decoded.userRole;
}
