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
  const defaultLongitude = 0
  const defaultLatitude = 0
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

  function spinGlobe(globe: mapboxgl.Map) {
    if (userInteracting) return
    const secondsPerRevolution = 120
    // Above zoom level 5, do not rotate.
    const maxSpinZoom = 5
    // Rotate at intermediate speeds between zoom levels 3 and 5.
    const slowSpinZoom = 3

    const zoom = globe.getZoom()
    if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
      let distancePerSecond = 360 / secondsPerRevolution
      if (zoom > slowSpinZoom) {
        // Slow spinning at higher zooms
        const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom)
        distancePerSecond *= zoomDif
      }
      const center = globe.getCenter()
      center.lng -= distancePerSecond
      if (center.lng <= -180) center.lng += 360
      // Smoothly animate the map over one second.
      // When this animation is complete, it calls a 'moveend' event.
      globe.easeTo({ center, duration: 1000, easing: (n) => n })
    }
  }

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

    spinGlobe(map.current)
  }, [state.type])

  // Init event handlers
  useEffect(() => {
    const current = map.current
    if (!current) return
    // Pause spinning on interaction
    current.on("mousedown", () => {
      setUserInteracting(true)
    })

    // Restart spinning the globe when interaction is complete
    current.on("mouseup", () => {
      setUserInteracting(false)
      spinGlobe(current)
    })

    // These events account for cases where the mouse has moved
    // off the map, so 'mouseup' will not be fired.
    current.on("dragend", () => {
      setUserInteracting(false)
      spinGlobe(current)
    })
    current.on("pitchend", () => {
      setUserInteracting(false)
      spinGlobe(current)
    })
    current.on("rotateend", () => {
      setUserInteracting(false)
      spinGlobe(current)
    })

    // When animation is complete, start spinning if there is no ongoing interaction
    current.on("moveend", () => {
      spinGlobe(current)
    })
  }, [])

  const [userInteracting, setUserInteracting] = useState(false)
  const [spinEnabled, setSpinEnabled] = useState(true)

  // useEffect(() => {
  //   if (!map.current) return
  //   const current = map.current
  //   if (userInteracting) {
  //     current.stop()
  //   } else if (!spinEnabled) {
  //     current.stop()
  //   } else {
  //     spinGlobe(current)
  //   }
  // }, [userInteracting, spinEnabled, map.current])

  return (
    <main className="grid h-full w-full grid-rows-[auto_minmax(0,_1fr)] ">
      <Header />
      {state.type === "loading" ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <div className="grid h-full grid-cols-2 gap-4 pb-24">
          <div className="flex h-full flex-col justify-center gap-4 ">
            <h2 className="text-xl font-semibold">Realtime monitoring</h2>
            <Card>
              <div className="flex flex-col divide-y-[1px] divide-slate-300 px-6 ">
                {!chosenFactory ? (
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
                ) : (
                  <Summary
                    city={chosenFactory.location.city}
                    country={chosenFactory.location.country}
                    riskStatus={chosenFactory.risk_status}
                    articles={
                      chosenFactory.risk_status.has_risk
                        ? chosenFactory.risk_status.articles
                        : []
                    }
                    onBackButtonClick={() => {
                      setChosenFactory(null)
                      goToLocation(
                        chosenFactory.location.coordinates.lat,
                        chosenFactory.location.coordinates.lon,
                        defaultZoom,
                      )
                    }}
                  />
                )}
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
      )}
    </main>
  )
}
