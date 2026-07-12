"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  username: string
  email?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("authToken")

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          localStorage.removeItem("authToken")
        }
      } catch (error) {
        console.error("Token verification failed:", error)
        localStorage.removeItem("authToken")
      } finally {
        setLoading(false)
      }
    }

    verifyToken()

    // Also listen for storage changes (in case token was set in another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken") {
        verifyToken()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const logout = () => {
    localStorage.removeItem("authToken")
    setUser(null)
    router.push("/auth/login")
  }

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
