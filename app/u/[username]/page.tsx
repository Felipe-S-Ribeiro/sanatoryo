"use client";

import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";

type Post = {
  id: number;
  content: string;
  emoji: string;
  created_at: string;
};

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    const user = JSON.parse(storedUser);
    setCurrentUser(user);

    async function loadProfile() {
      const resolvedParams = await params;

      const response = await fetch(
        `/api/users/${resolvedParams.username}?viewerId=${user.id}`
      );

      const data = await response.json();

      setProfile(data.user);
      setPosts(data.posts || []);
      setIsFollowing(data.isFollowing || false);
      setFollowersCount(Number(data.followersCount || 0));
      setFollowingCount(Number(data.followingCount || 0));
    }

    loadProfile();
  }, [params]);

  async function toggleFollow() {
    if (!currentUser || !profile) return;

    await fetch("/api/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followerId: currentUser.id,
        followingId: profile.id,
      }),
    });

    const resolvedParams = await params;

    const response = await fetch(
      `/api/users/${resolvedParams.username}?viewerId=${currentUser.id}`
    );

    const data = await response.json();

    setIsFollowing(data.isFollowing || false);
    setFollowersCount(Number(data.followersCount || 0));
    setFollowingCount(Number(data.followingCount || 0));
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        Carregando perfil...
      </main>
    );
  }

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Sidebar />
      <Navbar />

      <div className="w-full max-w-2xl p-6 mx-auto lg:ml-[calc(18rem+12vw)]">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 mb-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-violet-700 flex items-center justify-center text-3xl font-bold">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profile.name?.[0]
                )}
              </div>

              <div>
                <h1 className="text-3xl font-black">{profile.name}</h1>

                <p className="text-zinc-400">@{profile.username}</p>

                {profile.bio && (
                  <p className="mt-3 text-zinc-300">{profile.bio}</p>
                )}

                <div className="mt-3 flex gap-4 text-sm text-zinc-400">
                  <span>{posts.length} posts</span>
                  <span>{followersCount} seguidores</span>
                  <span>{followingCount} seguindo</span>
                </div>
              </div>
            </div>

            {!isOwnProfile && (
              <button
                onClick={toggleFollow}
                className={`rounded-xl px-5 py-3 font-bold transition ${
                  isFollowing
                    ? "bg-zinc-800 hover:bg-zinc-700"
                    : "bg-violet-600 hover:bg-violet-500"
                }`}
              >
                {isFollowing ? "Seguindo" : "Seguir"}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
            >
              <p className="text-2xl mb-2">{post.emoji}</p>
              <p className="text-lg">{post.content}</p>
            </div>
          ))}

          {posts.length === 0 && (
            <p className="text-zinc-400">Este usuário ainda não postou.</p>
          )}
        </div>
      </div>
    </main>
  );
}