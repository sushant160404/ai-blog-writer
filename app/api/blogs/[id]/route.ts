import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const [rows]: any = await db.query(
    "SELECT title, content FROM blogs WHERE id = ?",
    [id]
  );

  if (!rows || rows.length === 0) {
    return NextResponse.json(
      { error: "Blog not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    title: rows[0].title,
    content: rows[0].content,
  });
}
