import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"

import "./globals.css"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Supply Signal",
  description: "Ensure a steady flow of supplies to your factory",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "mx-auto min-h-screen max-w-7xl bg-slate-50 px-16 font-sans antialiased",
          fontSans.variable,
        )}
      >
        {children}
      </body>
    </html>
  )
}
