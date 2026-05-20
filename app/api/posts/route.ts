import { NextResponse } from "next/server";
import { db } from "../../../src/lib/db";

export async function GET() {
  try {
    const result = await db.query(`
      SELECT
        posts.id,
        posts.content,
        posts.emoji,
        posts.image_url,
        posts.created_at,
        users.name,
        users.username,
        users.avatar_url,
        COUNT(DISTINCT likes.id) AS likes_count,
        COUNT(DISTINCT replies.id) AS replies_count
      FROM posts
      INNER JOIN users
        ON posts.author_id = users.id
      LEFT JOIN likes
        ON likes.post_id = posts.id
      LEFT JOIN replies
        ON replies.post_id = posts.id
      GROUP BY
        posts.id,
        users.name,
        users.username,
        users.avatar_url
      ORDER BY posts.created_at DESC
    `);

    const posts = result.rows;

    for (const post of posts) {
      const replies = await db.query(
        `
        SELECT
          replies.id,
          replies.content,
          replies.created_at,
          users.name,
          users.username,
          users.avatar_url
        FROM replies
        INNER JOIN users
          ON replies.user_id = users.id
        WHERE replies.post_id = $1
        ORDER BY replies.created_at ASC
        `,
        [post.id]
      );

      post.replies = replies.rows;
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao buscar posts." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { content, emoji, authorId, imageUrl } = body;

    if (!content || !authorId) {
      return NextResponse.json(
        { error: "Dados inválidos." },
        { status: 400 }
      );
    }

    const result = await db.query(
      `
      INSERT INTO posts (content, emoji, author_id, image_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [content, emoji, authorId, imageUrl || null]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao criar post." },
      { status: 500 }
    );
  }
}