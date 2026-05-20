"use client";

import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));

    window.location.href = "/feed";
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          Entrar
        </h1>

        <p className="text-zinc-400 mb-6">
          Bem-vindo ao Sanatoryo.
        </p>

        <input
          type="email"
          className="w-full mb-3 rounded-xl bg-zinc-800 border border-zinc-700 p-3 text-white"
          placeholder="E-mail"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="w-full mb-5 rounded-xl bg-zinc-800 border border-zinc-700 p-3 text-white"
          placeholder="Senha"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full rounded-xl bg-violet-600 p-3 text-white font-bold">
          Entrar
        </button>

	<p className="mt-5 text-center text-sm text-zinc-400">
  Ainda não tem conta?{" "}
  <button
    type="button"
    onClick={() => (window.location.href = "/cadastro")}
    className="font-bold text-violet-400 hover:text-violet-300"
  >
    Cadastre-se
  </button>
</p>

        {message && (
          <p className="mt-4 text-center text-red-400">
            {message}
          </p>
        )}
      </form>
    </main>
  );
}