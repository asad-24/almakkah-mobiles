import { getCollection } from "@/lib/db"
import { insertLocalItem, listLocalItems } from "@/lib/local-admin-store"
import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function GET() {
  try {
    const collection = await getCollection("gallery")
    const images = await collection.find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(images)
  } catch (error) {
    const images = await listLocalItems("gallery")
    return NextResponse.json(images, {
      headers: { "x-data-source": "local-fallback" },
    })
  }
}

export async function POST(request: NextRequest) {
  let title = ""
  let description = ""
  let filename = ""

  try {
    const formData = await request.formData()
    title = formData.get('title') as string
    description = formData.get('description') as string
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist, continue
    }

    // Generate unique filename
    const timestamp = Date.now()
    filename = `${timestamp}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filepath = join(uploadsDir, filename)

    // Save file
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Save to database
    const collection = await getCollection("gallery")
    const result = await collection.insertOne({
      title: title || 'Untitled',
      description: description || '',
      imageUrl: `/uploads/${filename}`,
      createdAt: new Date(),
    })

    return NextResponse.json({
      id: result.insertedId,
      imageUrl: `/uploads/${filename}`
    }, { status: 201 })
  } catch (error) {
    console.error('Gallery upload error:', error)

    try {
      if (!filename) {
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
      }

      const galleryImage = await insertLocalItem("gallery", {
        title: title || 'Untitled',
        description: description || '',
        imageUrl: `/uploads/${filename}`,
        createdAt: new Date().toISOString(),
      })

      return NextResponse.json({
        id: galleryImage._id,
        imageUrl: `/uploads/${filename}`
      }, { status: 201, headers: { "x-data-source": "local-fallback" } })
    } catch {
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }
  }
}
