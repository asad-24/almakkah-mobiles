"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import ElegantHero from "@/components/elegant-hero"
import ShaderBackground from "@/components/shader-background"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import Image from "next/image"

interface GalleryImage {
  _id: string
  title: string
  description: string
  imageUrl: string
  createdAt: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const getImageSrc = (src?: string) => (src?.startsWith("/") ? src : "/globe.svg")

  // Fetch gallery images
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("/api/gallery")
        if (!response.ok) {
          throw new Error("Failed to fetch gallery")
        }
        const data = await response.json()
        if (Array.isArray(data)) {
          setImages(data)
        } else {
          setImages([])
        }
      } catch (error) {
        console.error("Failed to fetch gallery:", error)
        setImages([])
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <ShaderBackground>
        <Header />
        <ElegantHero
          compact
          eyebrow="Inside Al Makkah Mobile"
          title="Shop"
          highlight="Gallery"
          subtitle="See showroom moments, featured products, and real updates from Al Makkah Mobile Faqirwali."
          badges={["Showroom photos", "Product highlights", "Fresh updates"]}
          actions={[{ label: "View Gallery", href: "#gallery-grid", variant: "primary" }, { label: "Visit Shop", href: "/contact#shop-map", variant: "secondary" }]}
          metrics={[
            { value: "Real", label: "Photos" },
            { value: "Fresh", label: "Updates" },
            { value: "Local", label: "Shop" },
          ]}
        />
      </ShaderBackground>

      <main id="gallery-grid" className="container mx-auto px-4 py-16">

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-foreground/60">Loading gallery...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/60">No images in the gallery yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div key={image._id} onClick={() => setSelectedImage(image)} className="group cursor-pointer">
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative w-full h-64 bg-card overflow-hidden">
                    <Image
                      src={getImageSrc(image.imageUrl)}
                      alt={image.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{image.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/70 line-clamp-2">{image.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 flex items-center justify-between p-4 border-b border-border bg-card">
                <h2 className="text-xl font-light text-foreground">{selectedImage.title}</h2>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1 hover:bg-foreground/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              <div className="p-6">
                <Image
                  src={getImageSrc(selectedImage.imageUrl)}
                  alt={selectedImage.title}
                  width={960}
                  height={640}
                  sizes="100vw"
                  className="mb-6 h-auto w-full rounded-lg"
                />
                <div>
                  <p className="text-sm text-foreground/70 mb-2">
                    <span className="font-medium text-foreground">Uploaded:</span>{" "}
                    {new Date(selectedImage.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-foreground/70">{selectedImage.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
