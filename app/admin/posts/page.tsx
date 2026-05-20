"use client";

import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";

type Post = {
  id: number;
  content: string;
  emoji: string;
  name: string;
  username: string;
  likes_count: string;
  replies_count: string;
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    if (parsedUser.role !== "ADMIN") {
      window.location.href = "/feed";
      return;
    }

    setCurrentUser(parsedUser);
    loadPosts();
  }, []);

  async function loadPosts() {
    const response = await fetch("/api/admin/posts");
    const data = await response.json();

    setPosts(data);
  }

  async function deletePost(id: number) {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;

    await fetch("/api/admin/posts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    loadPosts();
  }

  if (!currentUser) return null;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-4xl p-6">
        <button
          onClick={() => (window.location.href = "/admin")}
          className="mb-6 text-zinc-400 hover:text-white"
        >
          ← Voltar para usuários
        </button>

        <h1 className="mb-2 text-4xl font-bold">Moderação de posts</h1>

        <p className="mb-6 text-zinc-400">
          Exclua publicações inadequadas do Sanatoryo.
        </p>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-2xl">{post.emoji}</span>

                <div>
                  <p className="font-bold">{post.name}</p>
                  <p className="text-sm text-zinc-400">@{post.username}</p>
                </div>
              </div>

              <p className="mb-4 text-zinc-200">{post.content}</p>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2 text-sm text-zinc-400">
                  <span>❤️ {post.likes_count}</span>
                  <span>💬 {post.replies_count}</span>
                </div>

                <button
                  onClick={() => deletePost(post.id)}
                  className="rounded-xl bg-red-600 px-4 py-2 font-bold hover:bg-red-500"
                >
                  Excluir post
                </button>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <p className="text-zinc-400">Nenhum post encontrado.</p>
          )}
        </div>
      </div>
    </main>
  );
}