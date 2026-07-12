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
import { Edit2, Trash2, Plus, Loader2, Upload, X } from "lucide-react"

interface Mobile {
  _id: string
  name: string
  brand: string
  model: string
  price: number
  originalPrice?: number
  condition: 'new' | 'used' | 'refurbished'
  category: 'new-boxed' | 'second-hand'
  specifications: {
    storage: string
    ram: string
    camera: string
    battery: string
    display: string
    processor: string
  }
  images: string[]
  description: string
  availability: boolean
  warranty?: string
  batteryHealth?: number
  accessories: string[]
  features: string[]
  createdAt: Date
  updatedAt: Date
}

export default function ProductsManager() {
  const [products, setProducts] = useState<Mobile[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [mainImageIndex, setMainImageIndex] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    price: "",
    originalPrice: "",
    condition: "new" as 'new' | 'used' | 'refurbished',
    category: "new-boxed" as 'new-boxed' | 'second-hand',
    specifications: {
      storage: "",
      ram: "",
      camera: "",
      battery: "",
      display: "",
      processor: ""
    },
    description: "",
    warranty: "",
    batteryHealth: "",
    accessories: [] as string[],
    features: [] as string[],
    availability: true
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setFetchError(response.ok ? "" : data.error || "Products are temporarily unavailable")
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch products:", error)
      setFetchError("Products are temporarily unavailable")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith('specifications.')) {
      const specField = name.split('.')[1]
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value,
        },
      }))
    } else if (name === 'accessories' || name === 'features') {
      setFormData((prev) => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim()).filter(item => item),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "price" || name === "originalPrice" || name === "batteryHealth" 
          ? (value === "" ? "" : Number.parseFloat(value) || "") 
          : value,
      }))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const formDataUpload = new FormData()
    Array.from(files).forEach(file => {
      formDataUpload.append('images', file)
    })

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })
      
      if (response.ok) {
        const data = await response.json()
        setUploadedImages(prev => {
          const merged = [...prev, ...data.urls]
          // keep mainImageIndex within bounds
          setMainImageIndex(0)
          return merged
        })
      }
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      const next = prev.filter((_, i) => i !== index)
      if (mainImageIndex >= next.length) setMainImageIndex(Math.max(0, next.length - 1))
      return next
    })
  }

  const setAsMainImage = (index: number) => {
    // move selected image to the front so it's treated as primary
    setUploadedImages(prev => {
      if (index === 0) return prev
      const next = [...prev]
      const [img] = next.splice(index, 1)
      next.unshift(img)
      setMainImageIndex(0)
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const submitData = {
      ...formData,
      images: uploadedImages,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      batteryHealth: formData.batteryHealth ? Number(formData.batteryHealth) : undefined,
    }

    try {
      if (editingId) {
        await fetch(`/api/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        })
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        })
      }

      setFormData({ 
        name: "", 
        brand: "",
        model: "",
        price: "", 
        originalPrice: "",
        condition: "new",
        category: "new-boxed", 
        specifications: {
          storage: "",
          ram: "",
          camera: "",
          battery: "",
          display: "",
          processor: ""
        },
        description: "",
        warranty: "",
        batteryHealth: "",
        accessories: [],
        features: [],
        availability: true
      })
      setUploadedImages([])
      setEditingId(null)
      setIsOpen(false)
      fetchProducts()
    } catch (error) {
      console.error("Failed to save product:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (product: Mobile) => {
    setFormData({
      name: product.name,
      brand: product.brand,
      model: product.model,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      condition: product.condition,
      category: product.category,
      specifications: product.specifications,
      description: product.description,
      warranty: product.warranty || "",
      batteryHealth: product.batteryHealth?.toString() || "",
      accessories: product.accessories,
      features: product.features,
      availability: product.availability
    })
    setUploadedImages(product.images)
    setEditingId(product._id)
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await fetch(`/api/products/${id}`, { method: "DELETE" })
        fetchProducts()
      } catch (error) {
        console.error("Failed to delete product:", error)
      }
    }
  }

  return (
    <Card className="bg-black/50 border-white/10 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between bg-linear-to-r from-blue-600/20 to-purple-600/20 rounded-t-lg border-b border-white/10">
        <div>
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400">📱</span>
            </div>
            Mobile Products Management
          </CardTitle>
          <CardDescription className="text-white/70 mt-2">
            Manage your mobile phones inventory and pricing
          </CardDescription>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null)
                setFormData({ 
                  name: "", 
                  brand: "",
                  model: "",
                  price: "", 
                  originalPrice: "",
                  condition: "new",
                  category: "new-boxed", 
                  specifications: {
                    storage: "",
                    ram: "",
                    camera: "",
                    battery: "",
                    display: "",
                    processor: ""
                  },
                  description: "",
                  warranty: "",
                  batteryHealth: "",
                  accessories: [],
                  features: [],
                  availability: true
                })
                setUploadedImages([])
              }}
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/30 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/95 border-white/10 backdrop-blur-sm max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b border-white/10 pb-4">
              <DialogTitle className="text-2xl text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  {editingId ? <Edit2 className="w-4 h-4 text-blue-400" /> : <Plus className="w-4 h-4 text-blue-400" />}
                </div>
                {editingId ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Fill in the product details below
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Basic Information */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 text-sm">📱</span>
                  </div>
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Product Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. iPhone 15 Pro"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Brand</label>
                    <Input
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="e.g. Apple"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Model</label>
                    <Input
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="e.g. iPhone 15 Pro Max"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400"
                      required
                    >
                      <option value="new-boxed" className="bg-gray-800">New Box-Packed</option>
                      <option value="second-hand" className="bg-gray-800">Second-Hand</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 text-sm">💰</span>
                  </div>
                  Pricing & Condition
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Price (Rs.)</label>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="999.99"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Original Price (Rs.)</label>
                    <Input
                      name="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      placeholder="1199.99 (optional)"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-white mb-2">Condition</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400"
                    required
                  >
                    <option value="new" className="bg-gray-800">New</option>
                    <option value="used" className="bg-gray-800">Used</option>
                    <option value="refurbished" className="bg-gray-800">Refurbished</option>
                  </select>
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-sm">⚙️</span>
                  </div>
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Storage</label>
                    <Input
                      name="specifications.storage"
                      value={formData.specifications.storage}
                      onChange={handleInputChange}
                      placeholder="128GB"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">RAM</label>
                    <Input
                      name="specifications.ram"
                      value={formData.specifications.ram}
                      onChange={handleInputChange}
                      placeholder="8GB"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Camera</label>
                    <Input
                      name="specifications.camera"
                      value={formData.specifications.camera}
                      onChange={handleInputChange}
                      placeholder="48MP Triple Camera"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Battery</label>
                    <Input
                      name="specifications.battery"
                      value={formData.specifications.battery}
                      onChange={handleInputChange}
                      placeholder="5000mAh"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Display</label>
                    <Input
                      name="specifications.display"
                      value={formData.specifications.display}
                      onChange={handleInputChange}
                      placeholder="6.7 inch Super Retina XDR"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Processor</label>
                    <Input
                      name="specifications.processor"
                      value={formData.specifications.processor}
                      onChange={handleInputChange}
                      placeholder="A17 Pro Chip"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <span className="text-orange-400 text-sm">📋</span>
                  </div>
                  Additional Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Warranty</label>
                    <Input
                      name="warranty"
                      value={formData.warranty}
                      onChange={handleInputChange}
                      placeholder="1 Year Official Warranty"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Battery Health (%)</label>
                    <Input
                      name="batteryHealth"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.batteryHealth}
                      onChange={handleInputChange}
                      placeholder="95"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Features (comma-separated)</label>
                    <Input
                      name="features"
                      value={formData.features.join(', ')}
                      onChange={handleInputChange}
                      placeholder="5G, Face ID, Wireless Charging"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Accessories (comma-separated)</label>
                    <Input
                      name="accessories"
                      value={formData.accessories.join(', ')}
                      onChange={handleInputChange}
                      placeholder="Charger, Earphones, Case"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <span className="text-cyan-400 text-sm">📝</span>
                  </div>
                  Description
                </h3>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed product description..."
                  required
                  rows={4}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                />
              </div>

              {/* Image Upload */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-pink-500/20 rounded-full flex items-center justify-center">
                    <span className="text-pink-400 text-sm">🖼️</span>
                  </div>
                  Product Images
                </h3>
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-white/20 text-white hover:bg-white/10 rounded-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Images
                  </Button>
                  
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className={`w-full h-20 object-cover rounded-lg border ${index === 0 ? 'border-blue-500' : 'border-transparent'}`}
                          />

                          <div className="absolute left-2 top-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setAsMainImage(index)}
                              title="Set as main image"
                              className={`px-2 py-1 text-xs rounded bg-black/50 text-white backdrop-blur-sm ${index === 0 ? 'ring-2 ring-blue-400' : ''}`}
                            >
                              {index === 0 ? 'Main' : 'Set'}
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="border-white/20 text-white hover:bg-white/10 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-8"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Save Product
                    </>
                  )}
                </Button>
              </div>
            </form>
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
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <p className="text-white/70">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No products yet</h3>
            <p className="text-white/70 mb-6">Start by adding your first mobile product</p>
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Product
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 font-bold">{products.length}</span>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Total Products</p>
                    <p className="text-white font-semibold">{products.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 font-bold">
                      {products.filter(p => p.category === 'new-boxed').length}
                    </span>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">New Box-Packed</p>
                    <p className="text-white font-semibold">
                      {products.filter(p => p.category === 'new-boxed').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <span className="text-orange-400 font-bold">
                      {products.filter(p => p.category === 'second-hand').length}
                    </span>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Second-Hand</p>
                    <p className="text-white font-semibold">
                      {products.filter(p => p.category === 'second-hand').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 font-bold">
                      Rs. {products.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Total Value</p>
                    <p className="text-white font-semibold">
                      Rs. {products.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product._id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <CardContent className="p-4">
                    {/* Product Image */}
                    <div className="aspect-square bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <span className="text-4xl">📱</span>
                        </div>
                      )}

                      {/* Action Buttons Overlay */}
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="bg-black/50 hover:bg-black/70 text-white border border-white/20 rounded-full w-8 h-8 p-0"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product._id)}
                          className="bg-red-500/80 hover:bg-red-600 text-white rounded-full w-8 h-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-white text-lg line-clamp-2 mb-1">{product.name}</h3>
                        <p className="text-white/70 text-sm">{product.brand} {product.model}</p>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-green-400">Rs. {product.price.toLocaleString()}</p>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <p className="text-sm text-white/50 line-through">Rs. {product.originalPrice.toLocaleString()}</p>
                          )}
                        </div>
                        <Badge variant={product.category === "new-boxed" ? "default" : "secondary"} className="text-xs">
                          {product.category === "new-boxed" ? "New" : "Used"}
                        </Badge>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                          {product.specifications?.storage || "N/A"}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                          {product.specifications?.ram || "N/A"}
                        </div>
                      </div>

                      {/* Condition Badge */}
                      <div className="flex items-center justify-between">
                        <Badge className={
                          product.condition === 'new' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          product.condition === 'used' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                          'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }>
                          {product.condition}
                        </Badge>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          product.availability
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {product.availability ? 'Available' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
