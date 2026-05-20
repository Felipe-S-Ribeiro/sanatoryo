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
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
      >
        <h1 className="text-3xl font-bold mb-6">
          Sanatoryo
        </h1>

        <input
          className="w-full mb-3 rounded-lg bg-zinc-800 p-3"
          placeholder="Nome"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="w-full mb-3 rounded-lg bg-zinc-800 p-3"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          className="w-full mb-3 rounded-lg bg-zinc-800 p-3"
          placeholder="E-mail"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          className="w-full mb-4 rounded-lg bg-zinc-800 p-3"
          placeholder="Senha"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full rounded-lg bg-violet-600 p-3 font-bold">
          Criar conta
        </button>

        {message && (
          <p className="mt-4 text-center">
            {message}
          </p>
        )}
      </form>
    </main>
  );
}