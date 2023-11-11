"use client"

import { useState } from "react"

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

  return (
    <main className="w-full">
      <Header />
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-2">
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
                    onBackButtonClick={() =>
                      setState({ type: "default", factories })
                    }
                  />
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
