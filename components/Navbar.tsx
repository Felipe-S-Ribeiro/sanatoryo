"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
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
    <div className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur lg:ml-72">
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
        <button
          onClick={() => (window.location.href = "/feed")}
          className="text-lg font-black sm:text-xl"
        >
          Sanatoryo
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => (window.location.href = "/feed")}
            className="rounded-xl bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700 sm:px-4"
          >
            Feed
          </button>

          <button
            onClick={() => (window.location.href = "/perfil")}
            className="rounded-xl bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700 sm:px-4"
          >
            Perfil
          </button>

          {user?.role === "ADMIN" && (
            <button
              onClick={() => (window.location.href = "/admin")}
              className="hidden rounded-xl bg-violet-600 px-3 py-2 text-sm hover:bg-violet-500 sm:block sm:px-4"
            >
              Admin
            </button>
          )}

          <button
            onClick={logout}
            className="rounded-xl bg-red-600 px-3 py-2 text-sm hover:bg-red-500 sm:px-4"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}