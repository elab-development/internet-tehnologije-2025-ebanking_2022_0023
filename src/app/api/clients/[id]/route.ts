// app/api/clients/[id]/route.ts
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserFromRequest } from "@/lib/auth";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; 

    const user = await getUserFromRequest(req);
    if (user.role !== "ADMIN") {
      return new Response("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { firstName, lastName, phone } = body;

    await db
      .update(users)
      .set({
        firstName,
        lastName,
        phone,
      })
      .where(eq(users.id, id)); 

    return Response.json({ success: true });
  } catch (error) {
    return new Response("Unauthorized", { status: 401 });
  }
}
