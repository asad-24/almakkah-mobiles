"use client"

import Header from "@/components/header"
import ElegantHero from "@/components/elegant-hero"
import PulsingCircle from "@/components/pulsing-circle"
import ShaderBackground from "@/components/shader-background"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"

interface Offer {
  _id: string
  title: string
  description: string
  discount: number
  code: string
  active: boolean
  createdAt: string
}

interface Product {
  _id: string
  name: string
  brand?: string
  model?: string
  price: number
  originalPrice?: number
  condition?: 'new' | 'used' | 'refurbished'
  category: 'new-boxed' | 'second-hand'
  specifications?: {
    storage?: string
    ram?: string
    camera?: string
    battery?: string
    display?: string
    processor?: string
  }
  images?: string[]
  description?: string
  availability?: boolean
  warranty?: string
  batteryHealth?: number
  accessories?: string[]
  features?: string[]
  createdAt: string
  updatedAt?: string
}

export default function AlMakkahMobileFaqirwali() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loadingOffers, setLoadingOffers] = useState(true)
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [usedProducts, setUsedProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    fetchOffers()
    fetchProducts()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await fetch("/api/offers")
      if (!response.ok) {
        throw new Error("Failed to fetch offers")
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        setOffers(data)
      } else {
        setOffers([])
      }
    } catch (error) {
      console.error("Failed to fetch offers:", error)
      setOffers([])
    } finally {
      setLoadingOffers(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const [newRes, usedRes] = await Promise.all([
        fetch("/api/products?category=new-boxed"),
        fetch("/api/products?category=second-hand")
      ])
      const newData = newRes.ok ? await newRes.json() : []
      const usedData = usedRes.ok ? await usedRes.json() : []
      setNewProducts(Array.isArray(newData) ? newData : [])
      setUsedProducts(Array.isArray(usedData) ? usedData : [])
    } catch (error) {
      console.error("Failed to fetch products:", error)
      setNewProducts([])
      setUsedProducts([])
    } finally {
      setLoadingProducts(false)
    }
  }

  return (
    <>
      <ShaderBackground>
        <Header />
        <ElegantHero
          eyebrow="Trusted mobile shop in Faqirwali"
          title="Al Makkah Mobile"
          highlight="Faqirwali"
          subtitle="Buy genuine new and second-hand smartphones with reliable service, fair prices, and local support you can trust."
          badges={["Genuine devices", "New and second-hand", "Repair support"]}
        />
        <PulsingCircle />
      </ShaderBackground>

      {/* Shop Details & Featured Offers Section */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Why Choose <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Al Makkah Mobile Faqirwali?</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Experience the difference with our premium mobile shop services, 
              authentic products, and customer-first approach.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <CardTitle>Authentic Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">
                    100% genuine mobiles with official warranty. 
                    We guarantee the authenticity of every device we sell.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <CardTitle>Best Prices</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">
                    Competitive pricing on all devices. 
                    Get the best value for your money with our unbeatable offers.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.5L12 6.5M12 17.5L12 21.5M2.5 12L6.5 12M17.5 12L21.5 12" />
                    </svg>
                  </div>
                  <CardTitle>Expert Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">
                    Professional repair services and technical support. 
                    Our experts are here to help with all your mobile needs.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Featured Offers */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="bg-linear-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 text-center"
          >
            <h3 className="text-3xl font-bold text-white mb-4">🔥 Featured Offers</h3>
            <p className="text-xl text-white/80 mb-6">
              Limited time deals on premium smartphones
            </p>
            {loadingOffers ? (
              <div className="text-white/70">Loading offers...</div>
            ) : offers.length === 0 ? (
              <div className="text-white/70">No active offers available</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offers.slice(0, 2).map((offer) => (
                  <div key={offer._id} className="bg-white/10 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-white mb-2">{offer.title}</h4>
                    <p className="text-lg text-green-400 mb-2">{offer.discount}% OFF</p>
                    <p className="text-white/70 mb-4">{offer.description}</p>
                    <div className="bg-black/30 rounded px-3 py-1 inline-block">
                      <code className="text-white font-mono text-sm">Code: {offer.code}</code>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* New Box-Packed Mobiles Section */}
      <section className="bg-gray-900 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              New <span className="bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Box-Packed</span> Mobiles
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Latest smartphones with factory seal, full warranty, and original accessories.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loadingProducts ? (
              <div className="col-span-full text-center py-12">
                <div className="text-white/70">Loading products...</div>
              </div>
            ) : newProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-white/70">No new products available</div>
              </div>
            ) : (
              newProducts.slice(0, 8).map((product) => (
                <div key={product._id} className="transition-transform duration-200 hover:-translate-y-1">
                  <Card className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors">
                    <CardContent className="p-4">
                      <div className="relative aspect-square bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                            className="object-cover"
                          />
                        ) : (
                          <svg className="w-16 h-16 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                      {product.brand && product.model && (
                        <p className="text-sm text-white/70 mb-2">{product.brand} {product.model}</p>
                      )}
                      <p className="text-2xl font-bold text-green-400 mb-2">Rs. {product.price.toLocaleString()}</p>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-sm text-white/50 line-through mb-2">Rs. {product.originalPrice.toLocaleString()}</p>
                      )}
                      <p className="text-sm text-white/70 mb-4 line-clamp-2">{product.description || "Brand new, factory sealed"}</p>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Second-Hand Mobiles Section */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Quality <span className="bg-linear-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Second-Hand</span> Mobiles
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Carefully inspected pre-owned devices with great value and reliable performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loadingProducts ? (
              <div className="col-span-full text-center py-12">
                <div className="text-white/70">Loading products...</div>
              </div>
            ) : usedProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-white/70">No second-hand products available</div>
              </div>
            ) : (
              usedProducts.slice(0, 8).map((product) => (
                <div key={product._id} className="transition-transform duration-200 hover:-translate-y-1">
                  <Card className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors">
                    <CardContent className="p-4">
                      <div className="relative aspect-square bg-linear-to-br from-orange-500/20 to-red-500/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                            className="object-cover"
                          />
                        ) : (
                          <svg className="w-16 h-16 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                        {product.condition && product.condition !== 'new' && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                            {product.condition}
                          </span>
                        )}
                      </div>
                      {product.brand && product.model && (
                        <p className="text-sm text-white/70 mb-2">{product.brand} {product.model}</p>
                      )}
                      <p className="text-2xl font-bold text-orange-400 mb-2">Rs. {product.price.toLocaleString()}</p>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-sm text-white/50 line-through mb-2">Rs. {product.originalPrice.toLocaleString()}</p>
                      )}
                      <p className="text-sm text-white/70 mb-4 line-clamp-2">{product.description || "Excellent condition, tested"}</p>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
