"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(JSON.parse(storedUser));
  }, []);

  async function uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error);
      return;
    }

    setUser({
      ...user,
      avatar_url: data.url,
    });

    setMessage("Avatar carregado. Clique em salvar perfil.");
  }

  async function saveProfile() {
    const response = await fetch("/api/perfil", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user.id,
        name: user.name,
        username: user.username,
        bio: user.bio || "",
        avatarUrl: user.avatar_url || "",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    setMessage("Perfil atualizado com sucesso!");
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <>
        <Sidebar />
        <Navbar />
      </>

      <div className="max-w-2xl mx-auto p-6 lg:ml-72">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center mb-6">
            <div className="h-28 w-28 rounded-full bg-violet-700 flex items-center justify-center overflow-hidden text-4xl font-bold shadow-xl">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                user.name?.[0]?.toUpperCase()
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-black">
                {user.name}
              </h1>

              <p className="text-zinc-400 text-lg">
                @{user.username}
              </p>

              <p className="text-xs text-violet-400 mt-1">
                {user.role}
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadAvatar(file);
                }}
                className="mt-4 w-full rounded-xl bg-zinc-800 border border-zinc-700 p-3 text-sm text-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <input
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 p-3 outline-none focus:border-violet-500"
              placeholder="Nome"
              value={user.name || ""}
              onChange={(e) =>
                setUser({ ...user, name: e.target.value })
              }
            />

            <input
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 p-3 outline-none focus:border-violet-500"
              placeholder="Username"
              value={user.username || ""}
              onChange={(e) =>
                setUser({ ...user, username: e.target.value })
              }
            />

            <textarea
              className="w-full min-h-32 rounded-xl bg-zinc-800 border border-zinc-700 p-3 outline-none focus:border-violet-500"
              placeholder="Sua bio"
              value={user.bio || ""}
              onChange={(e) =>
                setUser({ ...user, bio: e.target.value })
              }
            />

            <button
              onClick={saveProfile}
              className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 transition p-3 font-bold"
            >
              Salvar perfil
            </button>

            {message && (
              <p className="text-center text-zinc-300">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}