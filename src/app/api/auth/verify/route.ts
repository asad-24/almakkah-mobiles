import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { DEFAULT_ADMIN_USERNAME, getDefaultAdminToken } from "@/lib/default-admin"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 })
    }

    if (token === getDefaultAdminToken()) {
      return NextResponse.json({
        valid: true,
        user: { id: DEFAULT_ADMIN_USERNAME, username: DEFAULT_ADMIN_USERNAME },
      })
    }

    const collection = await getCollection("users")
    const user = await collection.findOne({ token })

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    return NextResponse.json({
      valid: true,
      user: { id: user._id, username: user.username || user.email },
    })
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
