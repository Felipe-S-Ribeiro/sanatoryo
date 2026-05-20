"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      window.location.href = "/feed";
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <p className="text-zinc-400">Carregando Sanatoryo...</p>
    </main>
  );
}