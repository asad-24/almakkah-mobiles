import { getCollection } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { deleteLocalItem, isLocalId, listLocalItems, updateLocalItem } from "@/lib/local-admin-store"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (isLocalId(id)) {
      const offer = (await listLocalItems("offers")).find((item) => item._id === id)

      if (!offer) {
        return NextResponse.json({ error: "Offer not found" }, { status: 404 })
      }

      return NextResponse.json(offer, { headers: { "x-data-source": "local-fallback" } })
    }

    const collection = await getCollection("offers")
    const offer = await collection.findOne({ _id: new ObjectId(id) })

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    return NextResponse.json(offer)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch offer" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await request.json().catch(() => ({}))

  try {
    const { id } = await params
    if (isLocalId(id)) {
      const offer = await updateLocalItem("offers", id, body)

      if (!offer) {
        return NextResponse.json({ error: "Offer not found" }, { status: 404 })
      }

      return NextResponse.json({ message: "Offer updated successfully" }, { headers: { "x-data-source": "local-fallback" } })
    }

    const collection = await getCollection("offers")

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Offer updated successfully" })
  } catch (error) {
    const { id } = await params
    const offer = await updateLocalItem("offers", id, body)

    if (!offer) {
      return NextResponse.json({ error: "Failed to update offer" }, { status: 500 })
    }

    return NextResponse.json({ message: "Offer updated successfully" }, { headers: { "x-data-source": "local-fallback" } })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (isLocalId(id)) {
      const deleted = await deleteLocalItem("offers", id)

      if (!deleted) {
        return NextResponse.json({ error: "Offer not found" }, { status: 404 })
      }

      return NextResponse.json({ message: "Offer deleted successfully" }, { headers: { "x-data-source": "local-fallback" } })
    }

    const collection = await getCollection("offers")

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Offer deleted successfully" })
  } catch (error) {
    const { id } = await params
    const deleted = await deleteLocalItem("offers", id)

    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 })
    }

    return NextResponse.json({ message: "Offer deleted successfully" }, { headers: { "x-data-source": "local-fallback" } })
  }
}
