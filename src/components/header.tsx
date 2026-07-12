"use client"

import Link from "next/link"

export default function Header() {
  return (
    <header className="relative z-30 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/12 bg-black/25 px-4 py-3 shadow-[0_18px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:px-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-white text-sm font-black text-black shadow-[0_12px_30px_rgba(255,255,255,0.18)]">
            AM
          </span>
          <span className="hidden text-sm font-bold tracking-normal text-white sm:block md:text-base">
            Al Makkah Mobile Faqirwali
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 md:flex">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm font-medium text-white/72 transition-colors hover:bg-white/10 hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="rounded-full px-4 py-2 text-sm font-medium text-white/72 transition-colors hover:bg-white/10 hover:text-white"
          >
            Shop
          </Link>
          <Link
            href="/gallery"
            className="rounded-full px-4 py-2 text-sm font-medium text-white/72 transition-colors hover:bg-white/10 hover:text-white"
          >
            Gallery
          </Link>
          <Link
            href="/about"
            className="rounded-full px-4 py-2 text-sm font-medium text-white/72 transition-colors hover:bg-white/10 hover:text-white"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="rounded-full px-4 py-2 text-sm font-medium text-white/72 transition-colors hover:bg-white/10 hover:text-white"
          >
            Contact
          </Link>
        </nav>

        <div className="hidden min-w-24 sm:block" aria-hidden="true" />
      </div>
    </header>
  )
}
