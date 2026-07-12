"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function HeroContent() {
  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-6">
        {/* Video Background Placeholder */}
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="w-full h-full bg-linear-to-br from-blue-600/20 to-purple-600/20 rounded-lg">
            {/* Placeholder for shop video - replace with actual video */}
            <div className="flex items-center justify-center h-full text-white/40">
              <div className="text-center">
                <div className="w-20 h-20 border-2 border-white/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-sm">Shop Video Background</p>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
            Al Makkah Mobile
            <br />
            <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Faqirwali
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Your trusted mobile shop for the latest smartphones, 
          quality second-hand devices, and unbeatable prices. 
          Experience excellence in mobile technology.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-white/90 text-lg px-8 py-6 rounded-full font-semibold min-w-[200px]"
          >
            Shop Now
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full font-semibold min-w-[200px]"
          >
            View Gallery
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="text-white/80">
            <div className="text-3xl font-bold text-white mb-2">500+</div>
            <div className="text-sm">Happy Customers</div>
          </div>
          <div className="text-white/80">
            <div className="text-3xl font-bold text-white mb-2">100+</div>
            <div className="text-sm">Mobile Brands</div>
          </div>
          <div className="text-white/80">
            <div className="text-3xl font-bold text-white mb-2">5+</div>
            <div className="text-sm">Years Experience</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
