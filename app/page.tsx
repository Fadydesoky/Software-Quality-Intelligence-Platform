"use client"

import { Navbar } from "@/components/navbar"
import { LandingHero } from "@/components/landing-hero"
import { Activity } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <LandingHero />
      
      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
                <Activity className="h-4 w-4 text-background" />
              </div>
              <span className="font-semibold">Quality Predictor</span>
            </div>
            
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <button 
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                className="hover:text-foreground transition-colors"
              >
                How it works
              </button>
              <button 
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="hover:text-foreground transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => document.getElementById("use-cases")?.scrollIntoView({ behavior: "smooth" })}
                className="hover:text-foreground transition-colors"
              >
                Use cases
              </button>
              <Link href="/analyze" className="hover:text-foreground transition-colors">
                Analyze
              </Link>
            </nav>
            
            <p className="text-xs text-muted-foreground/60">
              Built for engineering teams who care about quality
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
