import { NextResponse } from "next/server";
import { db } from "../../../../src/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const url = new URL(request.url);
    const viewerId = url.searchParams.get("viewerId");

    const userResult = await db.query(
      `
      SELECT
        id,
        name,
        username,
        bio,
        avatar_url
      FROM users
      WHERE username = $1
      `,
      [username]
    );

    const user = userResult.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const postsResult = await db.query(
      `
      SELECT
        id,
        content,
        emoji,
        created_at
      FROM posts
      WHERE author_id = $1
      ORDER BY created_at DESC
      `,
      [user.id]
    );

    const followersResult = await db.query(
      `
      SELECT COUNT(*) AS count
      FROM follows
      WHERE following_id = $1
      `,
      [user.id]
    );

    const followingResult = await db.query(
      `
      SELECT COUNT(*) AS count
      FROM follows
      WHERE follower_id = $1
      `,
      [user.id]
    );

    let isFollowing = false;

    if (viewerId) {
      const followResult = await db.query(
        `
        SELECT id
        FROM follows
        WHERE follower_id = $1 AND following_id = $2
        `,
        [viewerId, user.id]
      );

      isFollowing = followResult.rows.length > 0;
    }

    return NextResponse.json({
      user,
      posts: postsResult.rows,
      followersCount: followersResult.rows[0].count,
      followingCount: followingResult.rows[0].count,
      isFollowing,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao buscar perfil." },
      { status: 500 }
    );
  }
}