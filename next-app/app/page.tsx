"use client"

import createGlobe from "cobe"
import { Factory } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { type CardData } from "@/components/Card"
import Header from "@/components/Header"
import { LineData, LineItem } from "@/components/LineItem"
import { NewsFeed } from "@/components/NewsFeed"

export default function Home() {
  const canvasRef = useRef()

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

  interface Location {
    city: string
    latitude: number
    longitude: number
  }

  const locations: Location[] = [
    {
      city: "San Francisco",
      latitude: 37.78,
      longitude: -122.412,
    },
    {
      city: "Berlin",
      latitude: 52.52,
      longitude: 13.405,
    },
    {
      city: "Tokyo",
      latitude: 35.676,
      longitude: 139.65,
    },
    {
      city: "Buenos Aires",
      latitude: -34.6,
      longitude: -58.38,
    },
  ]
  const locationToAngles = (latitude: number, longitude: number) => {
    return [
      Math.PI - ((longitude * Math.PI) / 180 - Math.PI / 2),
      (latitude * Math.PI) / 180,
    ]
  }
  const focusRef = useRef([0, 0])
  const [isRotating, setRotating] = useState(true)

  useEffect(() => {
    let width = 0
    let currentPhi = 0
    let currentTheta = 0
    const doublePi = Math.PI * 2
    const onResize = () =>
      canvasRef.current && (width = canvasRef.current.offsetWidth)
    window.addEventListener("resize", onResize)
    onResize()

    const globe = createGlobe(canvasRef.current, {
      phi: 0,
      theta: 0,
      mapSamples: 16000,
      mapBrightness: 6.5,
      mapBaseBrightness: 0.0,
      diffuse: 1.2,
      dark: 0,
      baseColor: [1, 1, 1],
      markerColor: [1, 0, 0],
      markers: locations.map(({ latitude, longitude }) => ({
        location: [latitude, longitude],
        size: 0.05,
      })),
      scale: 1,
      opacity: 0.85,
      glowColor: [0.7, 0.7, 0.7],
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      onRender: (state) => {
        if (isRotating) {
          state.phi = currentPhi
          currentPhi += 0.001
        } else {
          state.phi = currentPhi
          state.theta = currentTheta
          const [focusPhi, focusTheta] = focusRef.current
          const distPositive = (focusPhi - currentPhi + doublePi) % doublePi
          const distNegative = (currentPhi - focusPhi + doublePi) % doublePi
          // Control the speed
          if (distPositive < distNegative) {
            currentPhi += distPositive * 0.08
          } else {
            currentPhi -= distNegative * 0.08
          }
          currentTheta = currentTheta * 0.92 + focusTheta * 0.08
          state.width = width * 2
          state.height = width * 2
        }
      },
    })

    return () => globe.destroy()
  }, [isRotating])

  return (
    <main className="w-full">
      <Header />
      <div className="flex flex-col gap-8">
        <NewsFeed cardData={cardData} />
        <div className="grid grid-cols-2">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Realtime monitoring</h2>
            <div className="flex flex-col divide-y-[1px] divide-slate-300 rounded-md border border-slate-200 bg-white px-6">
              {lineData.map((props) => (
                <LineItem key={crypto.randomUUID()} {...props} />
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
          <div
            className="control-buttons flex flex-col items-center justify-center md:flex-row"
            style={{ gap: ".5rem" }}
          >
            Rotate to:
            {locations.map(({ city, latitude, longitude }) => (
              <button
                key={crypto.randomUUID()}
                onClick={() => {
                  focusRef.current = locationToAngles(latitude, longitude)
                  setRotating(false)
                }}
              >
                📍 {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
