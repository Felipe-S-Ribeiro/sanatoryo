import { NextResponse } from "next/server";
import { db } from "../../../../src/lib/db";

export async function GET() {
  try {
    const result = await db.query(`
      SELECT
        posts.id,
        posts.content,
        posts.emoji,
        posts.created_at,
        users.name,
        users.username,
        COUNT(DISTINCT likes.id) AS likes_count,
        COUNT(DISTINCT replies.id) AS replies_count
      FROM posts
      INNER JOIN users
        ON posts.author_id = users.id
      LEFT JOIN likes
        ON likes.post_id = posts.id
      LEFT JOIN replies
        ON replies.post_id = posts.id
      GROUP BY posts.id, users.name, users.username
      ORDER BY posts.created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao buscar posts." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID inválido." },
        { status: 400 }
      );
    }

    await db.query("DELETE FROM posts WHERE id = $1", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao excluir post." },
      { status: 500 }
    );
  }
}