import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const files = data.getAll('images') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads')
    
    // Ensure upload directory exists
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist, continue
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue // Skip non-image files
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate unique filename
      const fileExtension = file.name.split('.').pop()
      const fileName = `${randomUUID()}.${fileExtension}`
      const filePath = join(uploadDir, fileName)

      await writeFile(filePath, buffer)
      
      // Return the public URL
      uploadedUrls.push(`/uploads/${fileName}`)
    }

    return NextResponse.json({ urls: uploadedUrls })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}