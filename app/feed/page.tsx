"use client";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";

type Reply = {
  id: number;
  content: string;
  name: string;
  username: string;
  avatar_url: string;
};

type Post = {
  id: number;
  content: string;
  emoji: string;
  image_url: string;
  name: string;
  username: string;
  avatar_url: string;
  likes_count: string;
  replies_count: string;
  replies: Reply[];
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [emoji, setEmoji] = useState("💭");
  const [imageUrl, setImageUrl] = useState("");
  const [user, setUser] = useState<any>(null);
  const [replyText, setReplyText] = useState<Record<number, string>>({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(JSON.parse(storedUser));
    loadPosts();
  }, []);

  async function loadPosts() {
    const response = await fetch("/api/posts");
    const data = await response.json();

    setPosts(data);
  }

  async function uploadPostImage(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      setImageUrl(data.url);
    }
  }

  async function createPost() {
    if (!content.trim() || !user) return;

    await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        emoji,
        imageUrl,
        authorId: user.id,
      }),
    });

    setContent("");
    setImageUrl("");

    loadPosts();
  }

  async function toggleLike(postId: number) {
    if (!user) return;

    await fetch(`/api/posts/${postId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
      }),
    });

    loadPosts();
  }

  async function createReply(postId: number) {
    if (!user) return;

    const text = replyText[postId];

    if (!text || !text.trim()) return;

    await fetch(`/api/posts/${postId}/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        content: text,
      }),
    });

    setReplyText({
      ...replyText,
      [postId]: "",
    });

    loadPosts();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Sidebar />
      <Navbar />

      <div className="w-full max-w-2xl p-6 mx-auto lg:ml-[calc(18rem+12vw)]">
        <h1 className="text-4xl font-bold mb-2">Sanatoryo</h1>

        <p className="text-zinc-400 mb-6">
          Compartilhe suas opiniões.
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6">
          <div className="flex gap-2 mb-3">
            <input
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="w-20 rounded-xl bg-zinc-800 p-3"
            />

            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="O que você está pensando?"
              className="flex-1 rounded-xl bg-zinc-800 p-3"
            />
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                uploadPostImage(file);
              }
            }}
            className="w-full rounded-xl bg-zinc-800 p-3 text-sm mb-3"
          />

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="mb-3 max-h-80 w-full rounded-2xl object-cover"
            />
          )}

          <button
            onClick={createPost}
            className="w-full rounded-xl bg-violet-600 p-3 font-bold hover:bg-violet-500 transition"
          >
            Publicar
          </button>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-violet-700 flex items-center justify-center text-white font-bold">
                  {post.avatar_url ? (
                    <img
                      src={post.avatar_url}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    post.name?.[0]
                  )}
                </div>

                <div>
                  <p className="font-bold">{post.name}</p>

                  <button
                    onClick={() =>
                      (window.location.href = `/u/${post.username}`)
                    }
                    className="text-zinc-400 text-sm hover:text-violet-400 transition"
                  >
                    @{post.username}
                  </button>
                </div>
              </div>

              <p className="text-2xl mb-2">{post.emoji}</p>

              <p className="text-lg">{post.content}</p>

              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Imagem do post"
                  className="mt-4 max-h-96 w-full rounded-2xl object-cover border border-zinc-800"
                />
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => toggleLike(post.id)}
                  className="rounded-xl bg-zinc-800 px-4 py-2 hover:bg-zinc-700 transition"
                >
                  ❤️ {post.likes_count}
                </button>

                <div className="rounded-xl bg-zinc-800 px-4 py-2 text-zinc-300">
                  💬 {post.replies_count}
                </div>
              </div>

              <div className="mt-5 space-y-3 border-t border-zinc-800 pt-4">
                {post.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="rounded-xl bg-zinc-950 border border-zinc-800 p-3"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-violet-700 flex items-center justify-center text-xs font-bold">
                        {reply.avatar_url ? (
                          <img
                            src={reply.avatar_url}
                            alt="Avatar"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          reply.name?.[0]
                        )}
                      </div>

                      <p className="text-sm font-bold">
                        {reply.name}{" "}
                        <span className="text-zinc-500">
                          @{reply.username}
                        </span>
                      </p>
                    </div>

                    <p className="text-zinc-300">{reply.content}</p>
                  </div>
                ))}

                <div className="flex gap-2">
                  <input
                    value={replyText[post.id] || ""}
                    onChange={(e) =>
                      setReplyText({
                        ...replyText,
                        [post.id]: e.target.value,
                      })
                    }
                    placeholder="Responder..."
                    className="flex-1 rounded-xl bg-zinc-800 p-3"
                  />

                  <button
                    onClick={() => createReply(post.id)}
                    className="rounded-xl bg-violet-600 px-4 font-bold hover:bg-violet-500 transition"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}