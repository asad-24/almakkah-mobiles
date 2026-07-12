import { getCollection } from "@/lib/db"
import { insertLocalItem, listLocalItems } from "@/lib/local-admin-store"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    const collection = await getCollection("products")
    const query = category ? { category } : {}
    const products = await collection.find(query).toArray()

    return NextResponse.json(products)
  } catch (error) {
    const products = await listLocalItems("products")
    const category = new URL(request.url).searchParams.get("category")
    const filteredProducts = category ? products.filter((product) => product.category === category) : products

    return NextResponse.json(filteredProducts, {
      headers: { "x-data-source": "local-fallback" },
    })
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))

  try {
    const collection = await getCollection("products")

    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    const product = await insertLocalItem("products", body)
    return NextResponse.json({ id: product._id }, { status: 201, headers: { "x-data-source": "local-fallback" } })
  }
}
