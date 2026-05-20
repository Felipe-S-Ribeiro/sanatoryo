import { NextResponse } from "next/server";
import { db } from "../../../../../src/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await request.json();

    const existing = await db.query(
      "SELECT * FROM likes WHERE user_id = $1 AND post_id = $2",
      [userId, id]
    );

    if (existing.rows.length > 0) {
      await db.query(
        "DELETE FROM likes WHERE user_id = $1 AND post_id = $2",
        [userId, id]
      );

      return NextResponse.json({ liked: false });
    }

    await db.query(
      "INSERT INTO likes (user_id, post_id) VALUES ($1, $2)",
      [userId, id]
    );

    return NextResponse.json({ liked: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao curtir post." },
      { status: 500 }
    );
  }
}