"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { ImageIcon, Package, ShoppingCart, Users, WifiOff } from "lucide-react"

interface Product {
  category?: string
}

interface DashboardStats {
  totalProducts: number
  totalOffers: number
  totalGalleryImages: number
  usingFallback: boolean
}

async function readArrayResponse(response: Response) {
  const data = await response.json().catch(() => [])
  return Array.isArray(data) ? data : []
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOffers: 0,
    totalGalleryImages: 0,
    usingFallback: false,
  })
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, offersRes, galleryRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/offers"),
          fetch("/api/gallery"),
        ])

        const [productsData, offersData, galleryData] = await Promise.all([
          readArrayResponse(productsRes),
          readArrayResponse(offersRes),
          readArrayResponse(galleryRes),
        ])

        setProducts(productsData)
        setStats({
          totalProducts: productsData.length,
          totalOffers: offersData.length,
          totalGalleryImages: galleryData.length,
          usingFallback: [productsRes, offersRes, galleryRes].some(
            (response) => response.headers.get("x-data-source") === "local-fallback" || !response.ok,
          ),
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
        setStats((current) => ({ ...current, usingFallback: true }))
      }
    }

    fetchStats()
  }, [])

  const categoryData = useMemo(() => {
    const newCount = products.filter((product) => product.category === "new-boxed").length
    const usedCount = products.filter((product) => product.category === "second-hand").length
    const otherCount = Math.max(products.length - newCount - usedCount, 0)

    return [
      { name: "New Box", value: newCount },
      { name: "Used", value: usedCount },
      { name: "Other", value: otherCount },
    ].filter((item) => item.value > 0 || products.length === 0)
  }, [products])

  const activityData = [
    { month: "Jan", products: 4, offers: 1 },
    { month: "Feb", products: 7, offers: 2 },
    { month: "Mar", products: 10, offers: 2 },
    { month: "Apr", products: 13, offers: 3 },
    { month: "May", products: 16, offers: 4 },
    { month: "Jun", products: Math.max(stats.totalProducts, 1), offers: Math.max(stats.totalOffers, 0) },
  ]

  return (
    <div className="space-y-8">
      {stats.usingFallback && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          <WifiOff className="size-5 shrink-0" />
          MongoDB is not reachable, so the dashboard is using local fallback data for now.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard title="Total Products" value={stats.totalProducts} label="Available catalog items" icon={<Package />} accent="text-sky-300" />
        <MetricCard title="Active Offers" value={stats.totalOffers} label="Running promotions" icon={<ShoppingCart />} accent="text-emerald-300" />
        <MetricCard title="Gallery Images" value={stats.totalGalleryImages} label="Showroom uploads" icon={<ImageIcon />} accent="text-violet-300" />
        <MetricCard title="Engagement" value="2.4K" label="Estimated visitors" icon={<Users />} accent="text-rose-300" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.06] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Shop Activity</CardTitle>
            <CardDescription className="text-white/55">Products and offers trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData} margin={{ left: -20, right: 12, top: 8, bottom: 8 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, color: "#fff" }} />
                  <Line type="monotone" dataKey="products" stroke="#38bdf8" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="offers" stroke="#a78bfa" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.06] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
            <CardDescription className="text-white/55">New box-packed vs second-hand inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ left: -20, right: 12, top: 8, bottom: 8 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, color: "#fff" }} />
                  <Bar dataKey="value" fill="#38bdf8" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  label,
  icon,
  accent,
}: {
  title: string
  value: string | number
  label: string
  icon: React.ReactNode
  accent: string
}) {
  return (
    <Card className="border-white/10 bg-white/[0.07] text-white shadow-[0_20px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-white/82">{title}</CardTitle>
        <div className={accent}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black">{value}</div>
        <p className="mt-1 text-xs text-white/50">{label}</p>
      </CardContent>
    </Card>
  )
}
