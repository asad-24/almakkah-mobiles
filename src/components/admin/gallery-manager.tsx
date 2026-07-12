"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Plus, Loader2, Upload, X, Image as ImageIcon } from "lucide-react"

interface GalleryImage {
  _id: string
  title: string
  description: string
  imageUrl: string
  createdAt: string
}

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/gallery")
      const data = await response.json()
      setFetchError(response.ok ? "" : data.error || "Gallery is temporarily unavailable")
      setImages(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch gallery images:", error)
      setFetchError("Gallery is temporarily unavailable")
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSubmitting(true)

    const formDataUpload = new FormData()
    formDataUpload.append('image', file)
    formDataUpload.append('title', formData.title || 'Untitled')
    formDataUpload.append('description', formData.description || '')

    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({ title: "", description: "" })
        setIsOpen(false)
        fetchImages()
      } else {
        console.error('Upload failed')
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (image: GalleryImage) => {
    setFormData({
      title: image.title,
      description: image.description,
    })
    setEditingId(image._id)
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        // For now, we'll just remove from database
        // In a real app, you'd also want to delete the file from the filesystem
        await fetch(`/api/gallery/${id}`, { method: "DELETE" })
        fetchImages()
      } catch (error) {
        console.error("Failed to delete image:", error)
      }
    }
  }

  return (
    <Card className="bg-black/50 border-white/10 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between bg-linear-to-r from-purple-600/20 to-pink-600/20 rounded-t-lg border-b border-white/10">
        <div>
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-purple-400" />
            </div>
            Gallery Management
          </CardTitle>
          <CardDescription className="text-white/70 mt-2">
            Upload and manage gallery images for your showroom
          </CardDescription>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null)
                setFormData({ title: "", description: "" })
              }}
              className="rounded-full bg-purple-600 hover:bg-purple-700 text-white border border-purple-500/30 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/95 border-white/10 backdrop-blur-sm max-w-md">
            <DialogHeader className="border-b border-white/10 pb-4">
              <DialogTitle className="text-2xl text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Upload className="w-4 h-4 text-purple-400" />
                </div>
                Upload Gallery Image
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Add a new image to your gallery
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Image Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Showroom Interior"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe this image..."
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400"
                />
              </div>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={submitting}
                  className="w-full border-white/20 text-white hover:bg-white/10 rounded-full"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image File
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {fetchError && (
          <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            {fetchError}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
              <p className="text-white/70">Loading gallery...</p>
            </div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No images yet</h3>
            <p className="text-white/70 mb-6">Start by uploading your first gallery image</p>
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload First Image
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 font-bold">{images.length}</span>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Total Images</p>
                    <p className="text-white font-semibold">{images.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center">
                    <span className="text-pink-400 font-bold">
                      {new Set(images.map(img => new Date(img.createdAt).toDateString())).size}
                    </span>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Upload Days</p>
                    <p className="text-white font-semibold">
                      {new Set(images.map(img => new Date(img.createdAt).toDateString())).size}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image) => (
                <Card key={image._id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <CardContent className="p-4">
                    {/* Image */}
                    <div className="aspect-square bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                      <img
                        src={image.imageUrl}
                        alt={image.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                      />

                      {/* Action Buttons Overlay */}
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(image)}
                          className="bg-black/50 hover:bg-black/70 text-white border border-white/20 rounded-full w-8 h-8 p-0"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(image._id)}
                          className="bg-red-500/80 hover:bg-red-600 text-white rounded-full w-8 h-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Image Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-white text-lg line-clamp-2">{image.title}</h3>
                      <p className="text-white/70 text-sm line-clamp-2">{image.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/50">
                          {new Date(image.createdAt).toLocaleDateString()}
                        </span>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                          Gallery
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-black/95 border border-white/10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10 bg-black/95">
              <h2 className="text-xl font-light text-white">{selectedImage.title}</h2>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full rounded-lg mb-6"
              />
              <div>
                <p className="text-sm text-white/70 mb-2">
                  <span className="font-medium text-white">Uploaded:</span>{" "}
                  {new Date(selectedImage.createdAt).toLocaleDateString()}
                </p>
                <p className="text-white/70">{selectedImage.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
