"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import ElegantHero from "@/components/elegant-hero"
import ShaderBackground from "@/components/shader-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Product {
  _id: string
  name: string
  price: number
  category: string
  description: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()
        const productsData = Array.isArray(data) ? data : []
        setProducts(productsData)
        setFilteredProducts(productsData)
      } catch (error) {
        console.error("Failed to fetch products:", error)
        setProducts([])
        setFilteredProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredProducts(filtered)
  }, [searchQuery, products])

  return (
    <div className="min-h-screen bg-background">
      <ShaderBackground>
        <Header />
        <ElegantHero
          compact
          eyebrow="Complete product catalog"
          title="All"
          highlight="Products"
          subtitle="Search every available mobile, compare prices, and find the right phone for your budget."
          badges={["New phones", "Used phones", "Price search"]}
          actions={[{ label: "Search Products", href: "#product-search", variant: "primary" }, { label: "Open Shop", href: "/shop", variant: "secondary" }]}
          metrics={[
            { value: "All", label: "Catalog" },
            { value: "Fast", label: "Search" },
            { value: "Fair", label: "Prices" },
          ]}
        />
      </ShaderBackground>

      <main className="container mx-auto px-4 py-16">

        {/* Search Bar */}
        <div id="product-search" className="mb-8 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full"
          />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-foreground/60">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/60">No products found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
                      <CardDescription className="text-xs">{product.category}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2 flex-shrink-0">
                      Rs. {product.price}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-foreground/70 mb-4 line-clamp-2">{product.description}</p>
                  <Button className="w-full rounded-full" size="sm">
                    View
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
