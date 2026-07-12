"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminHeader from "@/components/admin/admin-header"
import ProductsManager from "@/components/admin/products-manager"
import OffersManager from "@/components/admin/offers-manager"
import GalleryManager from "@/components/admin/gallery-manager"
import AnalyticsDashboard from "@/components/admin/analytics-dashboard"
import { ProtectedRoute } from "@/components/protected-route"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(37,99,235,0.22),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(139,92,246,0.2),transparent_32%),linear-gradient(135deg,#020617_0%,#030712_52%,#050816_100%)]" />
        <AdminHeader />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
          <div className="mb-8">
            <p className="text-sm font-medium text-sky-300">Admin dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-white sm:text-4xl">
              Manage your mobile shop
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">
              Update products, promotions, showroom images, and overview insights from one clean workspace.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-2 rounded-[24px] border border-white/10 bg-white/[0.06] p-1.5 backdrop-blur-xl md:grid-cols-4">
              <TabsTrigger value="overview" className="rounded-[18px] py-3 text-white/65 data-[state=active]:bg-white data-[state=active]:text-black">
                Overview
              </TabsTrigger>
              <TabsTrigger value="products" className="rounded-[18px] py-3 text-white/65 data-[state=active]:bg-white data-[state=active]:text-black">
                Products
              </TabsTrigger>
              <TabsTrigger value="offers" className="rounded-[18px] py-3 text-white/65 data-[state=active]:bg-white data-[state=active]:text-black">
                Offers
              </TabsTrigger>
              <TabsTrigger value="gallery" className="rounded-[18px] py-3 text-white/65 data-[state=active]:bg-white data-[state=active]:text-black">
                Gallery
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="products" className="mt-8">
              <ProductsManager />
            </TabsContent>

            <TabsContent value="offers" className="mt-8">
              <OffersManager />
            </TabsContent>

            <TabsContent value="gallery" className="mt-8">
              <GalleryManager />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}
