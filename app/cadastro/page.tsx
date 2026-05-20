"use client";

import { useState } from "react";

export default function CadastroPage() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const response = await fetch("/api/cadastro", {
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

      setMessage("Cadastro realizado com sucesso!");
    } catch {
      setMessage("Erro ao conectar.");
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          Sanatoryo
        </h1>

        <p className="text-zinc-400 mb-6">
          Compartilhe suas opiniões.
        </p>

        <input
          className="w-full mb-3 rounded-xl bg-zinc-800 border border-zinc-700 p-3 text-white outline-none focus:border-violet-500"
          placeholder="Nome"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="w-full mb-3 rounded-xl bg-zinc-800 border border-zinc-700 p-3 text-white outline-none focus:border-violet-500"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          type="email"
          className="w-full mb-3 rounded-xl bg-zinc-800 border border-zinc-700 p-3 text-white outline-none focus:border-violet-500"
          placeholder="E-mail"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="w-full mb-5 rounded-xl bg-zinc-800 border border-zinc-700 p-3 text-white outline-none focus:border-violet-500"
          placeholder="Senha"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 transition p-3 text-white font-bold">
          Criar conta
        </button>

	<p className="mt-5 text-center text-sm text-zinc-400">
  Já tem conta?{" "}
  <button
    type="button"
    onClick={() => (window.location.href = "/login")}
    className="font-bold text-violet-400 hover:text-violet-300"
  >
    Entrar
  </button>
</p>

        {message && (
          <p className="mt-4 text-center text-zinc-300">
            {message}
          </p>
        )}
      </form>
    </main>
  );
}