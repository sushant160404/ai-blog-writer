import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Story title is required" },
        { status: 400 }
      );
    }

    // Cartoon-style AI prompt
    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content: `
You are a creative cartoon story writer.
Write fun, simple, imaginative stories.
Use playful language, humor, and emotions.
Suitable for kids and family.
Resolve: Create a satisfying ending.
`,
        },
        {
          role: "user",
          content: `Create a cartoon story with the title: "${title}"`,
        },
      ],
    });

    const story = response.choices[0].message.content || "";

    // Save story to DB
    await db.query(
      "INSERT INTO cartoon_stories (title, story) VALUES (?, ?)",
      [title, story]
    );

    return NextResponse.json({ title, story });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate story" },
      { status: 500 }
    );
  }
}
