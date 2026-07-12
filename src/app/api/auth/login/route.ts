import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_ADMIN_USERNAME,
  getDefaultAdminToken,
  hashPassword,
  isDefaultAdminLogin,
} from "@/lib/default-admin"

export async function POST(request: NextRequest) {
  let loginId = ""
  let submittedPassword = ""

  try {
    const { username, email, password } = await request.json()
    loginId = String(username || email || "").trim().toLowerCase()
    submittedPassword = String(password || "")

    if (!loginId || !submittedPassword) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    const collection = await getCollection("users")
    const defaultPasswordHash = hashPassword(DEFAULT_ADMIN_PASSWORD)

    await collection.updateOne(
      { username: DEFAULT_ADMIN_USERNAME },
      {
        $set: {
          username: DEFAULT_ADMIN_USERNAME,
          email: DEFAULT_ADMIN_EMAIL,
          password: defaultPasswordHash,
          role: "admin",
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true },
    )

    const user = await collection.findOne({
      $or: [{ username: loginId }, { email: loginId }],
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Simple password verification (in production, use bcrypt)
    const hashedPassword = hashPassword(submittedPassword)

    if (user.password !== hashedPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate simple token (in production, use JWT)
    const token = crypto.randomBytes(32).toString("hex")

    // Store token in database
    await collection.updateOne({ _id: user._id }, { $set: { token, lastLogin: new Date() } })

    return NextResponse.json({
      token,
      user: { id: user._id, username: user.username || user.email },
    })
  } catch (error) {
    console.error("Login error:", error)

    if (isDefaultAdminLogin(loginId, submittedPassword)) {
      return NextResponse.json({
        token: getDefaultAdminToken(),
        user: { id: DEFAULT_ADMIN_USERNAME, username: DEFAULT_ADMIN_USERNAME },
      })
    }

    if (loginId === DEFAULT_ADMIN_USERNAME) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
