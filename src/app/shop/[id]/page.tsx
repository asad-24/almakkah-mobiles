"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react"

interface Product {
  _id: string
  name: string
  price: number
  category: string
  description: string
  details?: string
  features?: string[]
  image?: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`)
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error("Failed to fetch product:", error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <p className="text-foreground/60">Loading product...</p>
        </main>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <p className="text-foreground/60">Product not found.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-card rounded-lg p-8 flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-48 h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                <span className="text-foreground/40 text-sm">Product Image</span>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-light text-foreground mb-2 instrument">{product.name}</h1>
                  <Badge className="rounded-full">{product.category}</Badge>
                </div>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2 rounded-full hover:bg-card transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${isFavorite ? "fill-destructive text-destructive" : "text-foreground/40"}`}
                  />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-3xl font-light text-foreground mb-4">Rs. {product.price}</p>
                <p className="text-foreground/70 text-base leading-relaxed mb-6">{product.description}</p>

                {product.details && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-foreground mb-2">Details</h3>
                    <p className="text-sm text-foreground/70">{product.details}</p>
                  </div>
                )}

                {product.features && product.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-foreground mb-3">Features</h3>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-foreground/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button className="flex-1 rounded-full" size="lg">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" className="flex-1 rounded-full bg-transparent" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16 pt-12 border-t border-border">
          <h2 className="text-2xl font-light text-foreground mb-6 instrument">
            Related <span className="font-medium italic">Products</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">Related Mobile {i}</CardTitle>
                  <CardDescription>Available Device</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70 mb-4">Quality mobile option available from our shop.</p>
                  <Button variant="outline" className="w-full rounded-full bg-transparent" size="sm">
                    View
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
