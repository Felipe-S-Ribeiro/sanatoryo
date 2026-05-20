import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "../../../src/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, username, email, password } = body;

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: "Preencha todos os campos." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `
      INSERT INTO users (name, username, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, username, email
      `,
      [name, username, email, passwordHash]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error(error);

    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Usuário ou e-mail já cadastrado." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao criar usuário." },
      { status: 500 }
    );
  }
}