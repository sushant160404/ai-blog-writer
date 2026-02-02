import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // AI text generation
    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content:
            "You are a human blog writer. Write in friendly tone with headings and examples.",
        },
        {
          role: "user",
          content: `Write a detailed blog on: ${title}`,
        },
      ],
    });

    const content = response.choices[0].message.content || "";

    // Save to DB
    await db.query(
      "INSERT INTO blogs (title, content) VALUES (?, ?)",
      [title, content]
    );

    return NextResponse.json({ title, content });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
