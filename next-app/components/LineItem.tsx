import { ChevronRightIcon } from "lucide-react"

import { Button } from "./Button"
import { Label } from "./Label"

export interface LineData {
  city: string
  country: string
  summary: string
  riskStatus: "high" | "medium" | "low"
}

type Props = LineData & {
  onButtonClick: () => void
}

export const LineItem = ({
  city,
  country,
  summary,
  riskStatus,
  onButtonClick,
}: Props) => {
  return (
    <div className="flex items-center justify-between gap-4 py-6">
      <div className="flex flex-col gap-2 ">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-slate-900">
            {city}, {country}
          </h3>
          <Label intent={riskStatus} />
        </div>
        <p className="text-sm text-slate-900">{summary}</p>
      </div>
      <Button onClick={onButtonClick} Icon={ChevronRightIcon} />
    </div>
  )
}
