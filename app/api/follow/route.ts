import { NextResponse } from "next/server";
import { db } from "../../../src/lib/db";

export async function POST(request: Request) {
  try {
    const { followerId, followingId } = await request.json();

    if (!followerId || !followingId || followerId === followingId) {
      return NextResponse.json(
        { error: "Dados inválidos." },
        { status: 400 }
      );
    }

    const existing = await db.query(
      `
      SELECT id FROM follows
      WHERE follower_id = $1 AND following_id = $2
      `,
      [followerId, followingId]
    );

    if (existing.rows.length > 0) {
      await db.query(
        `
        DELETE FROM follows
        WHERE follower_id = $1 AND following_id = $2
        `,
        [followerId, followingId]
      );

      return NextResponse.json({ following: false });
    }

    await db.query(
      `
      INSERT INTO follows (follower_id, following_id)
      VALUES ($1, $2)
      `,
      [followerId, followingId]
    );

    return NextResponse.json({ following: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao seguir usuário." },
      { status: 500 }
    );
  }
}