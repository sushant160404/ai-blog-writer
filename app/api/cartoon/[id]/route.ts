import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ 1. Await params
  const { id } = await context.params;

  // ✅ 2. Query DB
  const [rows]: any = await db.query(
    "SELECT title, story FROM cartoon_stories WHERE id = ?",
    [id]
  );

  // ✅ 3. Handle not found
  if (!rows || rows.length === 0) {
    return NextResponse.json(
      { error: "Story not found" },
      { status: 404 }
    );
  }

  // ✅ 4. Convert RowDataPacket → plain JSON
  const story = {
    title: rows[0].title,
    story: rows[0].story,
  };

  return NextResponse.json(story);
}
