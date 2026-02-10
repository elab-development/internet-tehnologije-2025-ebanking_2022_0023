// app/api/clients/route.ts
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);

  if (user.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  const clients = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
    })
    .from(users)
    .where(eq(users.role, "CLIENT"));

  return Response.json({ success: true, clients });
}
