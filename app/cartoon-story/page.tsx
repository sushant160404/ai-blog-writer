"use client";

import { useEffect, useState } from "react";

type StoryTitle = {
  id: number;
  title: string;
};

export default function CartoonStoryPage() {
  const [inputTitle, setInputTitle] = useState("");
  const [stories, setStories] = useState<StoryTitle[]>([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  // Load sidebar titles
  useEffect(() => {
    fetch("/api/cartoon")
      .then((res) => res.json())
      .then(setStories);
  }, []);

  // Generate NEW story
  const generateStory = async () => {
    if (!inputTitle) return;

    setLoading(true);

    const res = await fetch("/api/generate-cartoon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: inputTitle }),
    });

    const data = await res.json();

    setSelectedTitle(data.title);
    setStory(data.story);

    // Refresh sidebar
    const updated = await fetch("/api/cartoon").then((r) => r.json());
    setStories(updated);

    setLoading(false);
  };

  // Load SAVED story
  const loadStory = async (id: number) => {
    const res = await fetch(`/api/cartoon/${id}`);
    const data = await res.json();

    setSelectedTitle(data.title);
    setStory(data.story);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r p-4">
        <h2 className="font-semibold mb-3">🧸 Previous Stories</h2>
        <ul className="space-y-2">
          {stories.map((s) => (
            <li
              key={s.id}
              onClick={() => loadStory(s.id)}
              className="cursor-pointer hover:text-purple-600"
            >
              {s.title}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">
          Cartoon Story Generator 🧸
        </h1>

        {/* Generate Section */}
        <div className="mb-6">
          <input
            className="w-full border p-2 rounded mb-2"
            placeholder="Enter story title"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
          />
          <button
            onClick={generateStory}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Creating..." : "Generate Story"}
          </button>
        </div>

        {/* Content */}
        {!story && (
          <p className="text-gray-500">
            Generate a story or select one from sidebar 👈
          </p>
        )}

        {story && (
          <>
            <h2 className="text-2xl font-semibold mb-3">
              {selectedTitle}
            </h2>
            <p className="whitespace-pre-wrap">{story}</p>
          </>
        )}
      </main>
    </div>
  );
}
