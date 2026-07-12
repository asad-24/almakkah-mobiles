"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, Store, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function AdminHeader() {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/45 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-7">
          <Link href="/admin" className="flex items-center gap-3 text-white">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-white text-sm font-black text-black">
              AM
            </span>
            <span className="hidden text-base font-bold sm:block">
              Al Makkah Mobile <span className="text-sky-300">Admin</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <Link href="/admin" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15">
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
            <Link href="/shop" className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white">
              <Store className="size-4" />
              View Shop
            </Link>
          </nav>
        </div>

        <Button
          type="button"
          onClick={logout}
          className="rounded-full border border-white/10 bg-white/10 text-white hover:bg-white/15"
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}
