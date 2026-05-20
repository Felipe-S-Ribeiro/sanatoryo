import { NextResponse } from "next/server";
import { db } from "../../../../../src/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId, content } = await request.json();

    if (!userId || !content) {
      return NextResponse.json(
        { error: "Dados inválidos." },
        { status: 400 }
      );
    }

    const result = await db.query(
      `
      INSERT INTO replies (content, user_id, post_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [content, userId, id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao responder." },
      { status: 500 }
    );
  }
}