import { ChevronRightIcon } from "lucide-react"

import { Button } from "./Button"

export interface LineData {
  flag: string
  city: string
  country: string
  summary: string
  riskStatus: "high" | "medium" | "low"
}

type Props = LineData & {
  onButtonClick: () => void
}

export const LineItem = ({
  flag,
  city,
  country,
  summary,
  riskStatus,
  onButtonClick,
}: Props) => {
  const pillarColor = riskStatus === "high" ? "bg-red-600" : "bg-green-600"

  return (
    <div className="flex items-center justify-between gap-2 py-4">
      <div className="relative">
        <div
          className={`absolute left-0 h-full ${pillarColor} w-2 rounded-lg`}
        ></div>
        <div className="ml-6 flex flex-col gap-2 px-2 py-4">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-900">
              {flag} {city}, {country}
            </h3>
          </div>
          <p className="text-sm text-slate-900">{summary}</p>
        </div>
      </div>
      <Button onClick={onButtonClick} Icon={ChevronRightIcon} />
    </div>
  )
}
