"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import ShaderBackground from "@/components/shader-background"
import Footer from "@/components/footer"
import ElegantHero from "@/components/elegant-hero"
import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Smartphone, Battery, Camera, HardDrive, Cpu, Zap } from "lucide-react"

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

export default function ShopPage() {
  const [mobiles, setMobiles] = useState<Mobile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMobile, setSelectedMobile] = useState<Mobile | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchMobiles()
  }, [])

  const fetchMobiles = async () => {
    try {
      const response = await fetch("/api/products")
      if (!response.ok) {
        throw new Error("Failed to fetch mobiles")
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        setMobiles(data)
      } else {
        setMobiles([])
      }
    } catch (error) {
      console.error("Failed to fetch mobiles:", error)
      setMobiles([])
    } finally {
      setLoading(false)
    }
  }

  const filteredMobiles = mobiles.filter(mobile => {
    if (activeTab === "all") return true
    if (activeTab === "new") return mobile.category === "new-boxed"
    if (activeTab === "used") return mobile.category === "second-hand"
    return true
  })

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-500/20 text-green-400'
      case 'used': return 'bg-orange-500/20 text-orange-400'
      case 'refurbished': return 'bg-blue-500/20 text-blue-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <>
      <ShaderBackground>
        <Header />
        <ElegantHero
          compact
          eyebrow="Browse our mobile collection"
          title="Mobile"
          highlight="Shop"
          subtitle="Explore new box-packed phones, inspected second-hand devices, and trusted accessories in one polished catalog."
          badges={["Box-packed phones", "Second-hand deals", "Tested devices"]}
          actions={[{ label: "View Products", href: "#shop-products", variant: "primary" }, { label: "Contact Us", href: "/contact", variant: "secondary" }]}
          metrics={[
            { value: "100+", label: "Models" },
            { value: "2", label: "Categories" },
            { value: "Local", label: "Support" },
          ]}
        />
      </ShaderBackground>

      {/* Shop Content */}
      <section id="shop-products" className="bg-black py-20">
        <div className="container mx-auto px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-full mb-12">
              <TabsTrigger value="all" className="rounded-full">All Mobiles</TabsTrigger>
              <TabsTrigger value="new" className="rounded-full">New Box-Packed</TabsTrigger>
              <TabsTrigger value="used" className="rounded-full">Second-Hand</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-8">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-foreground/60">Loading mobiles...</p>
                </div>
              ) : filteredMobiles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-foreground/60">No mobiles found in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMobiles.map((mobile) => (
                    <div key={mobile._id} className="transition-transform duration-200 hover:-translate-y-1">
                      <Card className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer h-full"
                            onClick={() => setSelectedMobile(mobile)}>
                        <CardContent className="p-4">
                          <div className="aspect-square bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                            {mobile.images && mobile.images.length > 0 ? (
                              <Image
                                src={mobile.images[0]}
                                alt={mobile.name}
                                fill
                                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                className="object-cover"
                              />
                            ) : (
                              <Smartphone className="w-16 h-16 text-white/40" />
                            )}
                            {mobile.category === "second-hand" && (
                              <Badge className={`absolute top-2 right-2 ${getConditionColor(mobile.condition)}`}>
                                {mobile.condition}
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg line-clamp-2">{mobile.name}</h3>
                            <p className="text-sm text-white/70">{mobile.brand} {mobile.model}</p>

                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-2xl font-bold text-green-400">Rs. {mobile.price}</p>
                                {mobile.originalPrice && mobile.originalPrice > mobile.price && (
                                  <p className="text-sm text-white/50 line-through">Rs. {mobile.originalPrice}</p>
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {mobile.category === "new-boxed" ? "New" : "Used"}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-white/60 mt-3">
                              <div className="flex items-center gap-1">
                                <HardDrive className="w-3 h-3" />
                                {mobile.specifications?.storage || "N/A"}
                              </div>
                              <div className="flex items-center gap-1">
                                <Battery className="w-3 h-3" />
                                {mobile.specifications?.battery || "N/A"}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Mobile Details Modal */}
      {selectedMobile && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMobile(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-black/95 backdrop-blur-sm border border-white/10 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedMobile.name}</h2>
                  <p className="text-xl text-white/70">{selectedMobile.brand} {selectedMobile.model}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <Badge className={getConditionColor(selectedMobile.condition)}>
                      {selectedMobile.condition}
                    </Badge>
                    <Badge variant="outline">
                      {selectedMobile.category === "new-boxed" ? "New Box-Packed" : "Second-Hand"}
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMobile(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image */}
                <div className="aspect-square rounded-lg overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
                  {selectedMobile.images && selectedMobile.images.length > 0 ? (
                    <Image
                      src={selectedMobile.images[0]}
                      alt={selectedMobile.name}
                      width={720}
                      height={720}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                      <Smartphone className="w-32 h-32 text-white/40" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-6">
                  {/* Price */}
                  <div>
                    <div className="flex items-baseline gap-4">
                      <span className="text-4xl font-bold text-green-400">Rs. {selectedMobile.price}</span>
                      {selectedMobile.originalPrice && selectedMobile.originalPrice > selectedMobile.price && (
                        <span className="text-2xl text-white/50 line-through">Rs. {selectedMobile.originalPrice}</span>
                      )}
                    </div>
                    {selectedMobile.warranty && (
                      <p className="text-sm text-blue-400 mt-2">Warranty: {selectedMobile.warranty}</p>
                    )}
                  </div>

                  {/* Specifications */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Specifications</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <HardDrive className="w-5 h-5 text-blue-400" />
                          <span className="text-white/70">Storage</span>
                        </div>
                        <span className="text-white font-medium">{selectedMobile.specifications?.storage || "N/A"}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Cpu className="w-5 h-5 text-purple-400" />
                          <span className="text-white/70">RAM</span>
                        </div>
                        <span className="text-white font-medium">{selectedMobile.specifications?.ram || "N/A"}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Camera className="w-5 h-5 text-green-400" />
                          <span className="text-white/70">Camera</span>
                        </div>
                        <span className="text-white font-medium">{selectedMobile.specifications?.camera || "N/A"}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Battery className="w-5 h-5 text-orange-400" />
                          <span className="text-white/70">Battery</span>
                        </div>
                        <span className="text-white font-medium">{selectedMobile.specifications?.battery || "N/A"}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-yellow-400" />
                          <span className="text-white/70">Processor</span>
                        </div>
                        <span className="text-white font-medium">{selectedMobile.specifications?.processor || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  {selectedMobile.features && selectedMobile.features.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedMobile.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
                    <p className="text-white/70 leading-relaxed">{selectedMobile.description}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      Contact for Purchase
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </>
  )
}
