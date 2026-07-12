"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Edit2, Trash2, Plus, Loader2, Percent, Tag, Calendar } from "lucide-react"

interface Offer {
  _id: string
  title: string
  description: string
  discount: number
  code: string
  active: boolean
  createdAt: string
}

export default function OffersManager() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: "",
    code: "",
  })

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await fetch("/api/offers")
      const data = await response.json()
      setFetchError(response.ok ? "" : data.error || "Offers are temporarily unavailable")
      setOffers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch offers:", error)
      setFetchError("Offers are temporarily unavailable")
      setOffers([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "discount" ? Number.parseFloat(value) || "" : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingId) {
        await fetch(`/api/offers/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
      } else {
        await fetch("/api/offers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
      }

      setFormData({ title: "", description: "", discount: "", code: "" })
      setEditingId(null)
      setIsOpen(false)
      fetchOffers()
    } catch (error) {
      console.error("Failed to save offer:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (offer: Offer) => {
    setFormData({
      title: offer.title,
      description: offer.description,
      discount: offer.discount.toString(),
      code: offer.code,
    })
    setEditingId(offer._id)
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this offer?")) {
      try {
        await fetch(`/api/offers/${id}`, { method: "DELETE" })
        fetchOffers()
      } catch (error) {
        console.error("Failed to delete offer:", error)
      }
    }
  }

  const toggleOfferStatus = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/offers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentStatus }),
      })
      fetchOffers()
    } catch (error) {
      console.error("Failed to toggle offer status:", error)
    }
  }

  return (
    <Card className="bg-black/50 border-white/10 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between bg-linear-to-r from-green-600/20 to-blue-600/20 rounded-t-lg border-b border-white/10">
        <div>
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <Tag className="w-5 h-5 text-green-400" />
            </div>
            Offers & Promotions
          </CardTitle>
          <CardDescription className="text-white/70 mt-2">
            Create and manage promotional offers for your customers
          </CardDescription>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null)
                setFormData({ title: "", description: "", discount: "", code: "" })
              }}
              className="rounded-full bg-green-600 hover:bg-green-700 text-white border border-green-500/30 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/95 border-white/10 backdrop-blur-sm max-w-md">
            <DialogHeader className="border-b border-white/10 pb-4">
              <DialogTitle className="text-2xl text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  {editingId ? <Edit2 className="w-4 h-4 text-green-400" /> : <Plus className="w-4 h-4 text-green-400" />}
                </div>
                {editingId ? "Edit Offer" : "Create New Offer"}
              </DialogTitle>
              <DialogDescription className="text-white/70">
                {editingId ? "Update the offer details" : "Add a new promotional offer"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Offer Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Summer Sale"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Discount %</label>
                  <Input
                    name="discount"
                    type="number"
                    step="0.1"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Promo Code</label>
                  <Input
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="SUMMER20"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the offer"
                  required
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-400"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-linear-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-full"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      {editingId ? "Update" : "Create"} Offer
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-full"
                >
                  Cancel
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
              <Loader2 className="w-6 h-6 animate-spin text-green-400" />
              <p className="text-white/70">Loading offers...</p>
            </div>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No offers yet</h3>
            <p className="text-white/70 mb-6">Create your first promotional offer to attract customers</p>
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Offer
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 font-bold">{offers.length}</span>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Total Offers</p>
                    <p className="text-white font-semibold">{offers.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 font-bold">
                      {offers.filter(o => o.active).length}
                    </span>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Active Offers</p>
                    <p className="text-white font-semibold">
                      {offers.filter(o => o.active).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <span className="text-orange-400 font-bold">
                      {offers.filter(o => !o.active).length}
                    </span>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Inactive Offers</p>
                    <p className="text-white font-semibold">
                      {offers.filter(o => !o.active).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 font-bold">
                      {offers.length > 0 ? Math.max(...offers.map(o => o.discount)) : 0}%
                    </span>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Highest Discount</p>
                    <p className="text-white font-semibold">
                      {offers.length > 0 ? Math.max(...offers.map(o => o.discount)) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Offers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <Card key={offer._id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <CardContent className="p-6">
                    {/* Offer Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-xl mb-2 line-clamp-2">{offer.title}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            {offer.discount}% OFF
                          </Badge>
                          <Badge
                            className={offer.active ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-gray-500/20 text-gray-400 border-gray-500/30"}
                          >
                            {offer.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>

                      {/* Action Buttons Overlay */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(offer)}
                          className="bg-black/50 hover:bg-black/70 text-white border border-white/20 rounded-full w-8 h-8 p-0"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(offer._id)}
                          className="bg-red-500/80 hover:bg-red-600 text-white rounded-full w-8 h-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Promo Code */}
                    <div className="bg-white/5 rounded-lg p-3 mb-4 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-green-400" />
                          <span className="text-white/70 text-sm">Promo Code</span>
                        </div>
                        <code className="bg-black/50 px-3 py-1 rounded text-white font-mono text-sm">
                          {offer.code}
                        </code>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/70 text-sm mb-4 line-clamp-3">{offer.description}</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-white/50 text-xs">
                        <Calendar className="w-3 h-3" />
                        {new Date(offer.createdAt).toLocaleDateString()}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleOfferStatus(offer._id, offer.active)}
                        className={`text-xs px-3 py-1 rounded-full ${
                          offer.active
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}
                      >
                        {offer.active ? 'Deactivate' : 'Activate'}
                      </Button>
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
