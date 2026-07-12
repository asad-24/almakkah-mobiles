import { getCollection } from "@/lib/db"
import { deleteLocalItem, isLocalId, listLocalItems, updateLocalItem } from "@/lib/local-admin-store"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (isLocalId(id)) {
      const product = (await listLocalItems("products")).find((item) => item._id === id)

      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }

      return NextResponse.json(product, { headers: { "x-data-source": "local-fallback" } })
    }

    const collection = await getCollection("products")
    const product = await collection.findOne({ _id: new ObjectId(id) })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const body = await request.json().catch(() => ({}))

  try {
    const { id } = await params
    if (isLocalId(id)) {
      const product = await updateLocalItem("products", id, body)

      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }

      return NextResponse.json({ success: true }, { headers: { "x-data-source": "local-fallback" } })
    }

    const collection = await getCollection("products")

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
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const { id } = await params
    const product = await updateLocalItem("products", id, body)

    if (!product) {
      return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { headers: { "x-data-source": "local-fallback" } })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (isLocalId(id)) {
      const deleted = await deleteLocalItem("products", id)

      if (!deleted) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }

      return NextResponse.json({ success: true }, { headers: { "x-data-source": "local-fallback" } })
    }

    const collection = await getCollection("products")
    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const { id } = await params
    const deleted = await deleteLocalItem("products", id)

    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { headers: { "x-data-source": "local-fallback" } })
  }
}
