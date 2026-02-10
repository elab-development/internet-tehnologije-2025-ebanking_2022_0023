// API: fetch clients

// app/api/clients/manager/route.ts
import { db } from "@/db";
import { users, managerClients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserFromRequest } from "@/lib/auth"; // jwt helper 

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);

  if (user.role !== "MANAGER") {
    return new Response("Forbidden", { status: 403 });
  }

  const clients = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(managerClients)
    .innerJoin(users, eq(managerClients.clientID, users.id))
    .where(eq(managerClients.managerID, user.id));

  return Response.json({ success: true, clients });
}
