import "mapbox-gl/dist/mapbox-gl.css"
import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import Head from "next/head"

import { cn } from "@/lib/utils"

import "./globals.css"

const fontSans = FontSans({
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
    <>
      <Head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <html lang="en">
        <body
          className={cn(
            "mx-auto h-screen max-w-[90rem] bg-slate-50 px-16 font-sans antialiased",
            fontSans.variable,
          )}
        >
          {children}
        </body>
      </html>
    </>
  )
}
