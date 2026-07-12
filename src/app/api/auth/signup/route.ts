import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Admin account is already configured. Please use the login page." },
    { status: 403 },
  )
}
