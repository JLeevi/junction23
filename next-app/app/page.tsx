"use client"

import mapboxgl from "mapbox-gl"
import { useEffect, useRef, useState } from "react"

import type { Factory, ServerResponse } from "@/common/types"
import { Card } from "@/components/Card"
import Header from "@/components/Header"
import { LineItem } from "@/components/LineItem"
import { Summary } from "@/components/Summary"
import { animated, useSpring } from "@react-spring/web"

const MOCK_WITHOUT_RISK: Factory[] = [
  {
    location: {
      flag: "🇨🇴",
      country: "Colombia",
      city: "Bogota",
      coordinates: {
        lat: 4.678390790414742,
        lon: -74.08310452775451,
      },
    },
    risk_status: {
      has_risk: false,
    },
  },
  {
    location: {
      flag: "🇧🇷",
      country: "Brazil",
      city: "Onca Puma",
      coordinates: {
        lat: -6.605335306591729,
        lon: -51.100066887737015,
      },
    },
    risk_status: {
      has_risk: false,
    },
  },
  {
    location: {
      flag: "🇳🇱",
      country: "Holland",
      city: "Terneuzen",
      coordinates: {
        lat: 51.33013942257549,
        lon: 3.83565678442852,
      },
    },
    risk_status: {
      has_risk: false,
    },
  },
  {
    location: {
      flag: "🇿🇼",
      country: "Zimbabwe",
      city: "Harare",
      coordinates: {
        lat: -17.805176546407868,
        lon: 31.046041795875578,
      },
    },
    risk_status: {
      has_risk: false,
    },
  },
  {
    location: {
      flag: "🇩🇪",
      country: "Germany",
      city: "Berlin",
      coordinates: {
        lat: 52.558715181258684,
        lon: 13.50432896407948,
      },
    },
    risk_status: {
      has_risk: false,
    },
  },
  {
    location: {
      flag: "🇹🇷",
      country: "Turkey",
      city: "Ankara",
      coordinates: {
        lat: 39.96018250478697,
        lon: 32.863076953317126,
      },
    },
    risk_status: {
      has_risk: false,
    },
  },
]

const MOCK_WITH_RISK: Factory[] = [
  {
    location: {
      flag: "🇨🇴",
      country: "Colombia",
      city: "Bogota",
      coordinates: {
        lat: 4.678390790414742,
        lon: -74.08310452775451,
      },
    },
    risk_status: {
      has_risk: false,
    },
  },
  {
    location: {
      flag: "🇧🇷",
      country: "Brazil",
      city: "Onca Puma",
      coordinates: {
        lat: -6.605335306591729,
        lon: -51.100066887737015,
      },
    },
    risk_status: {
      has_risk: false,
    },
  },
  {
    location: {
      flag: "🇳🇱",
      country: "Holland",
      city: "Terneuzen",
      coordinates: {
        lat: 51.33013942257549,
        lon: 3.83565678442852,
      },
    },
    risk_status: {
      has_risk: false,
    },
  },
  {
    location: {
      flag: "🇿🇼",
      country: "Zimbabwe",
      city: "Harare",
      coordinates: {
        lat: -17.805176546407868,
        lon: 31.046041795875578,
      },
    },
    risk_status: {
      has_risk: false,
    },
  },
  {
    location: {
      flag: "🇩🇪",
      country: "Germany",
      city: "Berlin",
      coordinates: {
        lat: 52.558715181258684,
        lon: 13.50432896407948,
      },
    },
    risk_status: {
      has_risk: true,
      risk_title: "Potential disruption due to train derailment in Berlin",
      risk_summary:
        "A train transporting goods for local mining operations has derailed, leaving the mines without supplies.",
      articles: [
        {
          title: "Train derailed in Berlin",
          content:
            "A massive accident has happened in Berlin. A train transporting goods for local mining operations has derailed, leaving the mines without supplies.",
          url: "https://hs.fi",
        },
      ],
    },
  },
  {
    location: {
      flag: "🇹🇷",
      country: "Turkey",
      city: "Ankara",
      coordinates: {
        lat: 39.96018250478697,
        lon: 32.863076953317126,
      },
    },
    risk_status: {
      has_risk: false,
    },
  },
]

// If the new blob of factories has a new risk, return one new factory
// Else, return undefined
const tryGetNewRisk = (oldFactories: Factory[], newFactories: Factory[]) => {
  const newRedAlerts = newFactories.filter((f) => f.risk_status.has_risk)
  const oldRedAlerts = oldFactories.filter((f) => f.risk_status.has_risk)
  // Don't focus on first render
  if (oldFactories.length === 0) return
  const newRedAlert = newRedAlerts.find(
    (newF) =>
      !oldRedAlerts.find((oldF) => oldF.location.city === newF.location.city),
  )
  return newRedAlert
}

const areOldAndNewFactoriesEqual = (
  oldFactories: Factory[],
  newFactories: Factory[],
) => {
  if (oldFactories.length !== newFactories.length) return false
  return oldFactories.every((oldF) => {
    const newF = newFactories.find(
      (newF) => newF.location.city === oldF.location.city,
    )
    if (!newF) return false
    return (
      oldF.location.city === newF.location.city &&
      oldF.risk_status.has_risk === newF.risk_status.has_risk
    )
  })
}

let useRisks = false

export default function Home() {
  const defaultLongitude = 0
  const defaultLatitude = 0
  const defaultZoom = 1.3
  const [factories, setFactories] = useState<Factory[]>([])
  const [chosenFactory, setChosenFactory] = useState<Factory | null>(null)
  const pollInterval = 7000

  const mapboxID = "mapbox-globe"
  const mapContainer = useRef(null)
  const map = useRef<mapboxgl.Map>(null)
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([])
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string

  const transitionList = useSpring({
    opacity: chosenFactory ? 0 : 1, // You can customize the animation properties
    transform: `scale(${chosenFactory ? 0.7 : 1})`, // Another example property
    config: { tension: 170, friction: 20 }, // Example spring configuration
  })
  const transitionChosenFactory = useSpring({
    opacity: chosenFactory ? 1 : 0, // You can customize the animation properties
    transform: `scale(${chosenFactory ? 1 : 0.7})`, // Another example property
    config: { tension: 170, friction: 20 }, // Example spring configuration
  })

  const focusToNewRisk = (newRisk: Factory) => {
    setChosenFactory(newRisk)
  }

  const callNotifyEndpoint = async (factory: Factory) => {
    if (!factory.risk_status.has_risk) return
    const body = {
      eventDescription: factory.risk_status.risk_title,
    }
    await fetch("/api/alert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
  }

  const getSummaries = async () => {
    const response = await fetch("/api/summary", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const newFactories = (await response.json()) as ServerResponse

    // const newFactories = useRisks ? MOCK_WITH_RISK : MOCK_WITHOUT_RISK

    const factoriesAreEqual = areOldAndNewFactoriesEqual(
      factories,
      newFactories,
    )
    if (factoriesAreEqual) return

    const oldFactories = factories
    setFactories(
      newFactories.sort(
        (prev, curr) =>
          Number(curr.risk_status.has_risk) - Number(prev.risk_status.has_risk),
      ),
    )
    if (!oldFactories) return
    const newRisk = tryGetNewRisk(oldFactories, newFactories)
    if (newRisk) {
      focusToNewRisk(newRisk)
      callNotifyEndpoint(newRisk)
    }
  }

  useEffect(() => {
    // set useRisks to true after 10 seconds
    const timeoutId = setTimeout(() => {
      useRisks = true
    }, 5000)
    return () => clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    // Set up the interval to poll every x seconds
    const intervalId = setInterval(() => {
      getSummaries()
    }, pollInterval)

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId)
  }, [factories])

  const goToLocation = (
    latitude: number,
    longitude: number,
    zoom: number = defaultZoom,
  ) => {
    map.current?.flyTo({
      center: [longitude, latitude],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      speed: 3, // make the flying slow
      curve: 1, // change the speed at which it zooms out
      zoom: zoom,
    })
  }

  useEffect(() => {
    if (!chosenFactory) return
    goToLocation(
      chosenFactory.location.coordinates.lat,
      chosenFactory.location.coordinates.lon,
      9,
    )
  }, [chosenFactory])

  const initializeMap = () => {
    // ignore ts error for setting map.current
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    map.current = new mapboxgl.Map({
      container: mapboxID,
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL,
      center: [defaultLongitude, defaultLatitude],
      zoom: defaultZoom,

      projection: {
        name: "globe",
      },
    })
  }

  useEffect(() => {
    if (factories.length === 0) return
    if (map.current) return // initialize map only once
    initializeMap()
  }, [factories])

  useEffect(() => {
    const currentMap = map.current
    if (!currentMap) return // initialize map only once

    // Delete previous markers from the map
    markers.forEach((marker) => marker.remove())

    const newMarkers = factories.map((factory) => {
      const el = document.createElement("div")
      el.className = "marker"

      // make a marker for each factory and add to the map
      const marker = new mapboxgl.Marker({
        color: factory.risk_status.has_risk ? "#F87171" : "#34D399",
      })
        .setLngLat([
          factory.location.coordinates.lon,
          factory.location.coordinates.lat,
        ])
        .addTo(currentMap)
      return marker
    })

    setMarkers(newMarkers)
  }, [factories])

  return (
    <main className="grid h-full w-full grid-rows-[auto_minmax(0,_1fr)] ">
      <Header />
      {factories.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <div className="grid h-full grid-cols-2 gap-4 pb-24 pt-12">
          <div className="flex h-full flex-col justify-center gap-4">
            {!chosenFactory ? (
              <>
                <h2 className="text-xl font-semibold">Realtime monitoring</h2>
                <animated.div style={transitionList}>
                  <Card>
                    <div className="flex flex-col divide-y-[1px] divide-slate-300 px-6 ">
                      {factories.map((data, i) => (
                        <LineItem
                          {...data}
                          key={crypto.randomUUID()}
                          flag={data.location.flag}
                          country={data.location.country}
                          city={data.location.city}
                          summary={
                            data.risk_status.has_risk
                              ? data.risk_status.risk_title
                              : "Status stable"
                          }
                          riskStatus={
                            data.risk_status.has_risk ? "high" : "low"
                          }
                          onButtonClick={() => {
                            setChosenFactory(factories[i])
                          }}
                        />
                      ))}
                    </div>
                  </Card>
                </animated.div>
              </>
            ) : (
              <animated.div style={transitionChosenFactory}>
                <Card>
                  <div className="flex flex-col divide-y-[1px] divide-slate-300 px-6 ">
                    <Summary
                      flag={chosenFactory.location.flag}
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
                          defaultLatitude,
                          defaultLongitude,
                          defaultZoom,
                        )
                      }}
                    />
                  </div>
                </Card>
              </animated.div>
            )}
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
