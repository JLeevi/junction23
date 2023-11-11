"use client"

import mapboxgl from "mapbox-gl"
import { useEffect, useRef, useState } from "react"

import type { Factory, ServerResponse } from "@/common/types"
import { Card } from "@/components/Card"
import Header from "@/components/Header"
import { LineItem } from "@/components/LineItem"
import { Summary } from "@/components/Summary"

export default function Home() {
  type State =
    | {
        type: "loading"
      }
    | {
        type: "allFactories"
        factories: Factory[]
      }
  const [state, setState] = useState<State>({ type: "loading" })
  const [chosenFactory, setChosenFactory] = useState<Factory | null>(null)

  useEffect(() => {
    const getSummaries = async () => {
      const response = await fetch("/api/summary", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const json = (await response.json()) as ServerResponse
      console.log("JSON RESPONSE", json)
      setState({ type: "allFactories", factories: json })
    }
    getSummaries()
  }, [])

  // const [map, setMap] = useState<mapboxgl.Map>()
  const mapboxID = "mapbox-globe"

  let rotateInterval: NodeJS.Timeout

  const mapContainer = useRef(null)
  const map = useRef<mapboxgl.Map>(null)
  const defaultLongitude = -70.9
  const defaultLatitude = 42
  const defaultZoom = 1.3
  const [lon, setLng] = useState(defaultLongitude)
  const [lat, setLat] = useState(defaultLatitude)
  const [zoom, setZoom] = useState(defaultZoom)

  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  const goToLocation = (
    latitude: number,
    longitude: number,
    zoom: number = defaultZoom,
  ) => {
    map.current.flyTo({
      center: [longitude, latitude],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      speed: 3, // make the flying slow
      curve: 1, // change the speed at which it zooms out
      zoom: zoom,
    })
  }

  // Mapbox initialization code

  useEffect(() => {
    if (map.current) return // initialize map only once
    if (state.type !== "allFactories") return

    map.current = new mapboxgl.Map({
      container: mapboxID,
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL,
      center: [lon, lat],
      zoom: zoom,
      projection: {
        name: "globe",
      },
    })
    for (const factory of state.factories) {
      // create a HTML element for each feature
      const el = document.createElement("div")
      el.className = "marker"

      // make a marker for each feature and add to the map
      new mapboxgl.Marker({
        color: factory.risk_status.has_risk ? "#F87171" : "#34D399",
      })
        .setLngLat([
          factory.location.coordinates.lon,
          factory.location.coordinates.lat,
        ])
        .addTo(map.current)
    }
  }, [state.type])

  return (
    <main className="grid h-full w-full grid-rows-[auto_minmax(0,_1fr)] ">
      <Header />
      <div className="grid h-full grid-cols-2 gap-4">
        <div className="flex h-full flex-col justify-center gap-4 ">
          <h2 className="text-xl font-semibold">Realtime monitoring</h2>
          <Card>
            <div className="flex flex-col divide-y-[1px] divide-slate-300 px-6 ">
              {state.type === "allFactories" && !chosenFactory ? (
                state.factories.map((data, i) => (
                  <LineItem
                    {...data}
                    key={crypto.randomUUID()}
                    country={data.location.country}
                    city={data.location.city}
                    summary={
                      data.risk_status.has_risk
                        ? data.risk_status.risk_title
                        : "Status stable"
                    }
                    riskStatus={data.risk_status.has_risk ? "high" : "low"}
                    onButtonClick={() => {
                      setChosenFactory(state.factories[i])
                      goToLocation(
                        data.location.coordinates.lat,
                        data.location.coordinates.lon,
                        9,
                      )
                    }}
                  />
                ))
              ) : state.type === "allFactories" && chosenFactory ? (
                <Summary
                  city={chosenFactory.location.city}
                  country={chosenFactory.location.country}
                  riskStatus={chosenFactory.risk_status}
                  articles={[]}
                  onBackButtonClick={() => {
                    setChosenFactory(null)
                    goToLocation(
                      chosenFactory.location.coordinates.lat,
                      chosenFactory.location.coordinates.lon,
                      defaultZoom,
                    )
                  }}
                />
              ) : null}
            </div>
          </Card>
        </div>
        <div className="flex flex-col justify-center">
          <div
            ref={mapContainer}
            className="flex aspect-square w-full flex-col"
            id={mapboxID}
          ></div>
        </div>
      </div>
    </main>
  )
}
