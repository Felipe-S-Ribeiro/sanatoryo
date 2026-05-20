import { NextResponse } from "next/server";
import { db } from "../../../src/lib/db";

export async function PUT(request: Request) {
  try {
    const { id, name, username, bio, avatarUrl } = await request.json();

    if (!id || !name || !username) {
      return NextResponse.json(
        { error: "Dados obrigatórios ausentes." },
        { status: 400 }
      );
    }

    const result = await db.query(
      `
      UPDATE users
      SET name = $1,
          username = $2,
          bio = $3,
          avatar_url = $4
      WHERE id = $5
      RETURNING id, name, username, email, bio, avatar_url, role
      `,
      [name, username, bio, avatarUrl, id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error(error);

    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Esse username já está em uso." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao atualizar perfil." },
      { status: 500 }
    );
  }
}