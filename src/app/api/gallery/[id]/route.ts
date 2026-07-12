import { deleteLocalItem, isLocalId, listLocalItems, updateLocalItem } from "@/lib/local-admin-store"
import { getCollection } from "@/lib/db"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (isLocalId(id)) {
      const image = (await listLocalItems("gallery")).find((item) => item._id === id)

      if (!image) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 })
      }

      return NextResponse.json(image, { headers: { "x-data-source": "local-fallback" } })
    }

    const collection = await getCollection("gallery")
    const image = await collection.findOne({ _id: new ObjectId(id) })

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    return NextResponse.json(image)
  } catch {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const body = await request.json().catch(() => ({}))

  try {
    const { id } = await params
    if (isLocalId(id)) {
      const image = await updateLocalItem("gallery", id, body)

      if (!image) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 })
      }

      return NextResponse.json({ success: true }, { headers: { "x-data-source": "local-fallback" } })
    }

    const collection = await getCollection("gallery")
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    const { id } = await params
    const image = await updateLocalItem("gallery", id, body)

    if (!image) {
      return NextResponse.json({ error: "Failed to update image" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { headers: { "x-data-source": "local-fallback" } })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (isLocalId(id)) {
      const deleted = await deleteLocalItem("gallery", id)

      if (!deleted) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 })
      }

      return NextResponse.json({ success: true }, { headers: { "x-data-source": "local-fallback" } })
    }

    const collection = await getCollection("gallery")
    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    const { id } = await params
    const deleted = await deleteLocalItem("gallery", id)

    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { headers: { "x-data-source": "local-fallback" } })
  }
}
