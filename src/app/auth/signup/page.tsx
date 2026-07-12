import Link from "next/link"
import { LockKeyhole, ShieldCheck } from "lucide-react"

export default function SignupPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-black px-4 py-8 text-white sm:px-6">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_25%_20%,rgba(37,99,235,0.24),transparent_32%),radial-gradient(circle_at_80%_35%,rgba(139,92,246,0.2),transparent_34%),linear-gradient(135deg,#020617_0%,#030712_50%,#050816_100%)]" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center justify-center">
        <section className="w-full rounded-[32px] border border-white/12 bg-white/[0.07] p-8 text-center shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-10">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-white text-black shadow-[0_18px_50px_rgba(255,255,255,0.22)]">
            <ShieldCheck className="size-8" />
          </div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/75">
            <LockKeyhole className="size-4 text-sky-300" />
            Admin access is configured
          </p>
          <h1 className="text-3xl font-black tracking-normal text-white sm:text-4xl">
            Signup is closed
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/60">
            Al Makkah Mobile Faqirwali uses one protected admin account. Please sign in with the configured username.
          </p>
          <Link
            href="/auth/login"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-2xl bg-white px-8 text-base font-bold text-black shadow-[0_20px_60px_rgba(255,255,255,0.18)] transition-colors hover:bg-white/90"
          >
            Go to Login
          </Link>
        </section>
      </div>
    </main>
  )
}
