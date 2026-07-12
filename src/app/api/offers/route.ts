import { getCollection } from "@/lib/db"
import { insertLocalItem, listLocalItems } from "@/lib/local-admin-store"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const collection = await getCollection("offers")
    const offers = await collection.find({ active: true }).toArray()
    return NextResponse.json(offers)
  } catch (error) {
    const offers = await listLocalItems("offers")
    return NextResponse.json(offers.filter((offer) => offer.active !== false), {
      headers: { "x-data-source": "local-fallback" },
    })
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))

  try {
    const collection = await getCollection("offers")

    const result = await collection.insertOne({
      ...body,
      active: true,
      createdAt: new Date(),
    })

    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    const offer = await insertLocalItem("offers", {
      ...body,
      active: true,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ id: offer._id }, { status: 201, headers: { "x-data-source": "local-fallback" } })
  }
}
