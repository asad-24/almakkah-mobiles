import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const collection = await getCollection("contacts")

    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
      status: "new",
    })

    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
  }
}
