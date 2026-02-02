"use client";

import { useEffect, useState } from "react";

type BlogTitle = {
  id: number;
  title: string;
};

export default function BlogPage() {
  const [inputTitle, setInputTitle] = useState("");
  const [blogs, setBlogs] = useState<BlogTitle[]>([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Load sidebar titles (once)
  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then(setBlogs);
  }, []);

  // Generate NEW blog
  const generateBlog = async () => {
    if (!inputTitle) return;

    setLoading(true);

    const res = await fetch("/api/generate-blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: inputTitle }),
    });

    const data = await res.json();

    setSelectedTitle(data.title);
    setContent(data.content);

    // Refresh sidebar after save
    const updated = await fetch("/api/blogs").then((r) => r.json());
    setBlogs(updated);

    setLoading(false);
  };

  // Load SAVED blog on click
  const loadBlog = async (id: number) => {
    const res = await fetch(`/api/blogs/${id}`);
    const data = await res.json();

    setSelectedTitle(data.title);
    setContent(data.content);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r p-4">
        <h2 className="font-semibold mb-3">📚 Previous Blogs</h2>
        <ul className="space-y-2">
          {blogs.map((b) => (
            <li
              key={b.id}
              onClick={() => loadBlog(b.id)}
              className="cursor-pointer hover:text-blue-600"
            >
              {b.title}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">AI Blog Writer ✍️</h1>

        {/* Generate Section */}
        <div className="mb-6">
          <input
            className="w-full border p-2 rounded mb-2"
            placeholder="Enter blog title"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
          />
          <button
            onClick={generateBlog}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? "Generating..." : "Generate Blog"}
          </button>
        </div>

        {/* Content Section */}
        {!content && (
          <p className="text-gray-500">
            Generate a blog or select one from sidebar 👈
          </p>
        )}

        {content && (
          <>
            <h2 className="text-2xl font-semibold mb-3">
              {selectedTitle}
            </h2>
            <p className="whitespace-pre-wrap">{content}</p>
          </>
        )}
      </main>
    </div>
  );
}
