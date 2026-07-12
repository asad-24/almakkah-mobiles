"use client"

import Header from "@/components/header"
import ShaderBackground from "@/components/shader-background"
import Footer from "@/components/footer"
import ElegantHero from "@/components/elegant-hero"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <>
      <ShaderBackground>
        <Header />
        <ElegantHero
          compact
          eyebrow="Built on trust and service"
          title="About"
          highlight="Us"
          subtitle="Meet the people and values behind Al Makkah Mobile Faqirwali, where every customer gets honest guidance and dependable support."
          badges={["Local expertise", "Customer-first service", "Authentic products"]}
          actions={[{ label: "Our Story", href: "#about-content", variant: "primary" }, { label: "Contact Us", href: "/contact", variant: "secondary" }]}
          metrics={[
            { value: "5+", label: "Years" },
            { value: "500+", label: "Customers" },
            { value: "100%", label: "Commitment" },
          ]}
        />
      </ShaderBackground>

      {/* About Content */}
      <section id="about-content" className="bg-black py-20">
        <div className="container mx-auto px-6">
          {/* Shop Owner Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto mb-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Meet Our <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Owner</span>
                </h2>
                <div className="space-y-4 text-white/80">
                  <p className="text-lg">
                    <strong className="text-white">Ali Hassan</strong> - Founder & CEO
                  </p>
                  <p>
                    With over 5 years of experience in the mobile industry, Ali Hassan 
                    established Al Makkah Mobile Faqirwali with a vision to provide authentic, quality 
                    mobile phones at affordable prices.
                  </p>
                  <p>
                    His passion for technology and commitment to customer satisfaction has 
                    made Al Makkah Mobile Faqirwali a trusted name in the community. From the latest 
                    smartphones to reliable second-hand devices, we ensure every customer 
                    leaves satisfied.
                  </p>
                  <div className="pt-4">
                    <h3 className="text-xl font-semibold text-white mb-2">Contact Details:</h3>
                    <div className="space-y-2">
                      <p>📱 Phone: +92 300 1234567</p>
                      <p>📧 Email: info@almakkahmobile.com</p>
                      <p>🕐 Working Hours: 9:00 AM - 9:00 PM (Daily)</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-80 h-80 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white/60">
                    <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-sm">Owner Photo</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Our Story */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-12 text-center">
              Our <span className="bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Story</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🏪</span>
                    </div>
                    2019 - The Beginning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">
                    Started as a small mobile repair shop with a dream to provide 
                    quality mobile services to the local community.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📱</span>
                    </div>
                    2021 - Expansion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">
                    Expanded to selling new and second-hand mobile phones, 
                    becoming a one-stop shop for all mobile needs.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🌟</span>
                    </div>
                    2024 - Going Digital
                  </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-white/70">
                      Launched our online platform to serve customers nationwide 
                    with the same quality and trust they have come to expect.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Our Values */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-12 text-center">
              Our <span className="bg-linear-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Values</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Quality</h3>
                <p className="text-white/70">Only authentic products with genuine warranties</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Trust</h3>
                <p className="text-white/70">Building lasting relationships with our customers</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Value</h3>
                <p className="text-white/70">Best prices without compromising on quality</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Service</h3>
                <p className="text-white/70">Fast, reliable, and professional support</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  )
}
