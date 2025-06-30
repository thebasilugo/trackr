import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { FirebaseProvider } from "@/components/firebase-provider"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Trackr - Your Learning Journey, Organized and Synced",
  description:
    "Escape tutorial hell with organized learning paths. Track your progress across any learning domain with seamless cloud synchronization.",
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </FirebaseProvider>
      </body>
    </html>
  )
}
