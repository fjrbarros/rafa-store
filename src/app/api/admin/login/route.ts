import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";

  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";

  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      { error: "Credenciais de administrador não configuradas no servidor." },
      { status: 500 },
    );
  }

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
  }

  return NextResponse.json({ ok: true, email: adminEmail });
}
