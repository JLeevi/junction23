import { ChevronRightIcon } from "lucide-react"
import { ComponentProps } from "react"

import { Button } from "./Button"
import { Label, intent } from "./Label"

export interface LineData {
  city: string
  country: string
  summary: string
  riskScore: number
}

type Props = LineData & ComponentProps<"div">

export const LineItem = ({ city, country, summary, riskScore }: Props) => {
  const roundedRiskScore = Math.ceil(riskScore)
  const intentRanks: Record<number, keyof typeof intent> = {
    1: "rank_1",
    2: "rank_2",
    3: "rank_3",
    4: "rank_4",
    5: "rank_5",
    6: "rank_6",
    7: "rank_7",
    8: "rank_8",
    9: "rank_9",
    10: "rank_10",
  }

  return (
    <div className="flex items-center justify-between gap-4 py-6">
      <div className="flex flex-col gap-2 ">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-slate-900">
            {city}, {country}
          </h3>
          <Label intent={intentRanks[roundedRiskScore]} score={riskScore} />
        </div>
        <p className="text-sm text-slate-900">{summary}</p>
      </div>
      <Button Icon={ChevronRightIcon} />
    </div>
  )
}
