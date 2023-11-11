"use client"

import createGlobe from "cobe"
import { Factory } from "lucide-react"
import { useEffect, useRef } from "react"

import { Card, type CardData } from "@/components/Card"
import Header from "@/components/Header"
import { LineData, LineItem } from "@/components/LineItem"

export default function Home() {
  const canvasRef = useRef()

  useEffect(() => {
    let phi = 0

    const globe = createGlobe(canvasRef.current, {
      phi: 0,
      theta: 0,
      mapSamples: 16000,
      mapBrightness: 6.5,
      mapBaseBrightness: 0.0,
      diffuse: 1.2,
      dark: 0,
      baseColor: [1, 1, 1],
      markerColor: [0.1, 0.8, 1],
      markers: [
        // longitude latitude
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
      ],
      scale: 1,
      opacity: 0.85,
      glowColor: [0.7, 0.7, 0.7],
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi
        phi += 0.001
      },
    })

    return () => {
      globe.destroy()
    }
  }, [])

  const cardData: CardData[] = [
    {
      imagePath: "/logos/bloomberg.png",
      title: "Bloomberg",
      summary: "Someone was killed",
      Icon: Factory,
      city: "New York",
      country: "United States",
    },
    {
      imagePath: "/logos/bloomberg.png",
      title: "Bloomberg",
      summary: "Someone was killed",
      Icon: Factory,
      city: "New York",
      country: "United States",
    },
    {
      imagePath: "/logos/bloomberg.png",
      title: "Bloomberg",
      summary: "Someone was killed",
      Icon: Factory,
      city: "New York",
      country: "United States",
    },
    {
      imagePath: "/logos/bloomberg.png",
      title: "Bloomberg",
      summary: "Someone was killed",
      Icon: Factory,
      city: "New York",
      country: "United States",
    },
    {
      imagePath: "/logos/bloomberg.png",
      title: "Bloomberg",
      summary: "Someone was killed",
      Icon: Factory,
      city: "New York",
      country: "United States",
    },
  ]

  const lineData: LineData[] = [
    {
      city: "New York",
      country: "United States",
      riskScore: 7.2,
      summary: "Someone was killed",
    },
    {
      city: "New York",
      country: "United States",
      riskScore: 7.2,
      summary: "Someone was killed",
    },
    {
      city: "New York",
      country: "United States",
      riskScore: 7.2,
      summary: "Someone was killed",
    },
    {
      city: "New York",
      country: "United States",
      riskScore: 7.2,
      summary: "Someone was killed",
    },
    {
      city: "New York",
      country: "United States",
      riskScore: 7.2,
      summary: "Someone was killed",
    },
  ]

  return (
    <main className="w-full">
      <Header />
      <div className="flex flex-col gap-8">
        <div className="hidden-scrollbar flex w-full gap-4 overflow-x-auto py-4">
          {cardData.map((props) => (
            <Card {...props} />
          ))}
        </div>
        <div className="grid grid-cols-2">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Realtime monitoring</h2>
            <div className="flex flex-col divide-y-[1px] divide-slate-300 rounded-md border border-slate-200 bg-white px-6">
              {lineData.map((props) => (
                <LineItem {...props} />
              ))}
            </div>
          </div>
          <canvas
            ref={canvasRef}
            style={{
              width: 600,
              height: 600,
              maxWidth: "100%",
              aspectRatio: 1,
            }}
          />
        </div>
      </div>
    </main>
  )
}
