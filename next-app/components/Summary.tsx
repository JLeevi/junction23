import { LucideIcon, X } from "lucide-react"
import { ComponentProps } from "react"

import { RiskStatus } from "@/common/types"
import { Article } from "@/common/types"

import { Button } from "./Button"
import { NewsCard } from "./NewsCard"

interface Props extends ComponentProps<"div"> {
  flag: string
  city: string
  country: string
  riskStatus: RiskStatus
  articles?: Article[]
  onBackButtonClick: () => void
}

export const Summary = ({
  flag,
  city,
  country,
  riskStatus,
  articles,
  onBackButtonClick,
  ...props
}: Props) => {
  return (
    <div className="flex flex-col gap-8 py-6">
      <div className="flex justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-3xl font-semibold text-slate-800">
            {flag} {city}, {country}
          </h3>
          {riskStatus.has_risk ? (
            <h4 className="text-lg font-medium text-red-800">
              {riskStatus.risk_title}
            </h4>
          ) : (
            <h4 className="text-lg font-medium text-green-700">
              Status stable
            </h4>
          )}
        </div>
        <Button onClick={onBackButtonClick} Icon={X} />
      </div>
      {riskStatus.has_risk && (
        <div className="flex flex-col gap-2">
          <h4 className="text-base font-bold">Summary</h4>
          <p className="text-base font-normal">{riskStatus.risk_summary}</p>
        </div>
      )}
      {articles && articles.length > 0 && (
        <div className="flex flex-col gap-2">
          <>
            <h4 className="text-base font-bold">Sources</h4>
            {articles.map((article) => {
              return (
                <NewsCard
                  key={article.content}
                  summary={article.title}
                  url={article.url}
                />
              )
            })}
          </>
        </div>
      )}
    </div>
  )
}
