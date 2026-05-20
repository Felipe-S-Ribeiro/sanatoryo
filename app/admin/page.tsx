"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
};

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
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
    loadUsers();
  }, []);

  async function loadUsers() {
    const response = await fetch("/api/admin/users");
    const data = await response.json();

    setUsers(data);
  }

  async function changeRole(id: number, role: "USER" | "ADMIN") {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, role }),
    });

    loadUsers();
  }

  async function deleteUser(id: number) {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    loadUsers();
  }

  if (!currentUser) return null;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-2 text-4xl font-bold">
          Admin
        </h1>

        <p className="mb-6 text-zinc-400">
          Gerencie usuários do Sanatoryo.
        </p>

        <button
          onClick={() => (window.location.href = "/admin/posts")}
          className="mb-6 rounded-xl bg-violet-600 px-4 py-2 font-bold hover:bg-violet-500"
        >
          Moderar posts
        </button>

        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-bold">
                    {user.name}
                  </p>

                  <p className="text-sm text-zinc-400">
                    @{user.username}
                  </p>

                  <p className="text-sm text-zinc-500">
                    {user.email}
                  </p>

                  <p className="mt-2 text-xs text-violet-400">
                    {user.role}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {user.role === "USER" ? (
                    <button
                      onClick={() =>
                        changeRole(user.id, "ADMIN")
                      }
                      className="rounded-xl bg-violet-600 px-4 py-2 font-bold hover:bg-violet-500"
                    >
                      Tornar admin
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        changeRole(user.id, "USER")
                      }
                      className="rounded-xl bg-zinc-700 px-4 py-2 font-bold hover:bg-zinc-600"
                    >
                      Tornar user
                    </button>
                  )}

                  <button
                    onClick={() => deleteUser(user.id)}
                    className="rounded-xl bg-red-600 px-4 py-2 font-bold hover:bg-red-500"
                  >
                    Excluir
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