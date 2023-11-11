"use client"

import mapboxgl from "mapbox-gl"
import { useEffect, useRef, useState } from "react"

import type { Factory, ServerResponse } from "@/common/types"
import { Card } from "@/components/Card"
import Header from "@/components/Header"
import { LineItem } from "@/components/LineItem"
import { Summary } from "@/components/Summary"
import { factories } from "@/data/data"

export default function Home() {
  const getSummaries = async (): Promise<ServerResponse> => {
    const response = await fetch("/api/summary", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const json = (await response.json()) as ServerResponse
    return json
  }

  type State =
    | {
        type: "default"
        factories: Factory[]
      }
    | {
        type: "loading"
        factories: Factory[]
      }
    | {
        type: "factoryDetails"
        factory: Factory
      }

  const [state, setState] = useState<State>({ type: "default", factories })
  // const [map, setMap] = useState<mapboxgl.Map>()
  const mapboxID = "mapbox-globe"

  let rotateInterval: NodeJS.Timeout

  const mapContainer = useRef(null)
  const map = useRef<mapboxgl.Map>(null)
  const defaultLongitude = -70.9
  const defaultLatitude = 42
  const defaultZoom = 1
  const [lng, setLng] = useState(defaultLongitude)
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
    map.current = new mapboxgl.Map({
      container: mapboxID,
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL,
      center: [lng, lat],
      zoom: zoom,
      projection: {
        name: "globe",
      },
    })
  }, [])

  return (
    <main className="grid w-full grid-rows-[auto_minmax(0,_1fr)]">
      <Header />
      <div className="grid grid-cols-2 items-center gap-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Realtime monitoring</h2>
          <Card>
            <div className="flex flex-col divide-y-[1px] divide-slate-300 px-6 ">
              {state.type != "factoryDetails" ? (
                state.factories.map((data, i) => (
                  <LineItem
                    {...data}
                    key={crypto.randomUUID()}
                    country={data.location.country}
                    city={data.location.city}
                    summary={
                      data.risk_status.has_risk
                        ? data.risk_status.risk_summary
                        : "Status stable"
                    }
                    riskStatus={data.risk_status.has_risk ? "high" : "low"}
                    onButtonClick={() => {
                      setState({
                        type: "loading",
                        factories: state.factories,
                      })
                      goToLocation(
                        data.location.coordinates.lat,
                        data.location.coordinates.lon,
                        9,
                      )
                      setState({
                        type: "factoryDetails",
                        factory: factories[i],
                      })
                    }}
                  />
                ))
              ) : (
                <Summary
                  city={state.factory.location.city}
                  country={state.factory.location.country}
                  riskStatus={state.factory.risk_status}
                  articles={[]}
                  onBackButtonClick={() => {
                    setState({ type: "default", factories })
                    goToLocation(
                      state.factory.location.coordinates.lat,
                      state.factory.location.coordinates.lon,
                      defaultZoom,
                    )
                  }}
                />
              )}
            </div>
          </Card>
        </div>
        <div
          className="flex h-full w-full flex-col items-center"
          id={mapboxID}
        ></div>
      </div>
    </main>
  )
}
