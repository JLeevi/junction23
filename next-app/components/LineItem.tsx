import { ChevronRightIcon } from "lucide-react"
import { ComponentProps } from "react"

export interface LineData {
  city: string
  country: string
  summary: string
  riskScore: number
}

type Props = LineData & ComponentProps<"div">

export const LineItem = ({ city, country, summary, riskScore }: Props) => {
  return (
    <div className="flex justify-between gap-4 py-4">
      <div className="flex flex-col gap-2 ">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-slate-900">
            {city}, {country}
          </h3>
          <div className="flex h-5 w-11 items-center justify-center rounded-full bg-red-500 px-3 py-0.5 text-xs font-bold text-white">
            {riskScore}
          </div>
        </div>
        <p className="text-sm text-slate-900">{summary}</p>
      </div>
      <button className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-slate-200 bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 active:border-slate-300 active:bg-slate-300">
        <ChevronRightIcon />
      </button>
    </div>
  )
}
