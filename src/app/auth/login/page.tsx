"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Loader2, LockKeyhole, ShieldCheck, Smartphone, UserRound } from "lucide-react"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    username: "alihassan",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "The username or password is not correct.")
        return
      }

      localStorage.setItem("authToken", data.token)
      window.location.assign("/admin")
    } catch {
      setError("We could not sign you in. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-black px-4 py-8 text-white sm:px-6">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.25),transparent_32%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.22),transparent_34%),linear-gradient(135deg,#020617_0%,#030712_48%,#050816_100%)]" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[32px] border border-white/12 bg-white/[0.07] shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative hidden min-h-[560px] border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-white text-sm font-black text-black">
                  AM
                </span>
                <span className="text-lg font-bold">Al Makkah Mobile</span>
              </Link>

              <div className="mt-20">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/80">
                  <ShieldCheck className="size-4 text-emerald-300" />
                  Secure admin access
                </div>
                <h1 className="max-w-md text-5xl font-black leading-tight tracking-normal">
                  Smooth control for your mobile shop.
                </h1>
                <p className="mt-5 max-w-md text-lg leading-8 text-white/65">
                  Manage products, offers, gallery updates, and shop details from one calm dashboard.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {["Products", "Offers", "Gallery"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                  <Smartphone className="mx-auto mb-2 size-5 text-sky-300" />
                  <p className="text-sm font-medium text-white/75">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-md">
              <div className="mb-8 text-center lg:text-left">
                <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-white text-black shadow-[0_18px_50px_rgba(255,255,255,0.22)] lg:mx-0">
                  <LockKeyhole className="size-7" />
                </div>
                <h2 className="text-3xl font-black tracking-normal text-white sm:text-4xl">Welcome back</h2>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  Sign in with the default admin username to open the dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                    {error}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/80">Username</label>
                  <div className="relative">
                    <UserRound className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white/35" />
                    <Input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="alihassan"
                      required
                      className="h-13 rounded-2xl border-white/12 bg-white/10 pl-12 text-base text-white placeholder:text-white/35 focus-visible:ring-blue-400/35"
                    />
                  </div>
                  <p className="mt-2 text-xs text-white/45">Default username: alihassan</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/80">Password</label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white/35" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter admin password"
                      required
                      className="h-13 rounded-2xl border-white/12 bg-white/10 px-12 text-base text-white placeholder:text-white/35 focus-visible:ring-blue-400/35"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 transition-colors hover:text-white"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-13 w-full rounded-2xl bg-white text-base font-bold text-black shadow-[0_20px_60px_rgba(255,255,255,0.18)] hover:bg-white/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Open Dashboard"
                  )}
                </Button>
              </form>

              <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/55">
                Admin account is already configured. New signups are disabled for this dashboard.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
