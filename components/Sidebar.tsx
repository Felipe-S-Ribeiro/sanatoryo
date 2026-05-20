"use client";

import { useEffect, useState } from "react";

export default function Sidebar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  async function logout() {
  await fetch("/api/logout", {
    method: "POST",
  });

  localStorage.removeItem("user");
  window.location.href = "/login";
}

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-zinc-950 border-r border-zinc-800 flex-col p-6">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white">Sanatoryo</h1>
        <p className="text-zinc-500 mt-2">Painel de opiniões</p>
      </div>

      <nav className="flex flex-col gap-3">
        <button
          onClick={() => (window.location.href = "/feed")}
          className="rounded-2xl bg-zinc-900 hover:bg-zinc-800 transition p-4 text-left text-white font-semibold"
        >
          🏠 Feed
        </button>

        <button
          onClick={() => (window.location.href = "/perfil")}
          className="rounded-2xl bg-zinc-900 hover:bg-zinc-800 transition p-4 text-left text-white font-semibold"
        >
          👤 Perfil
        </button>

        {user?.role === "ADMIN" && (
          <button
            onClick={() => (window.location.href = "/admin")}
            className="rounded-2xl bg-zinc-900 hover:bg-zinc-800 transition p-4 text-left text-white font-semibold"
          >
            👑 Admin
          </button>
        )}

        <button
          onClick={logout}
          className="rounded-2xl bg-red-600 hover:bg-red-500 transition p-4 text-left text-white font-semibold mt-4"
        >
          🚪 Sair
        </button>
      </nav>

      {user && (
        <div className="mt-auto border-t border-zinc-800 pt-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-violet-600 overflow-hidden flex items-center justify-center font-bold text-white">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                user.name?.[0]
              )}
            </div>

            <div>
              <p className="font-bold text-white">{user.name}</p>
              <p className="text-sm text-zinc-500">@{user.username}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}