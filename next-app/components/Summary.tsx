import { LucideIcon, X } from "lucide-react"
import { ComponentProps } from "react"

import { RiskStatus } from "@/common/types"

import { Button } from "./Button"
import { NewsCard } from "./NewsCard"

interface Article {
  country: string
  city: string
  author: string
  summary: string
  Icon: LucideIcon
  imagePath: string
}

interface Props extends ComponentProps<"div"> {
  city: string
  country: string
  riskStatus: RiskStatus
  articles: Article[]
  onBackButtonClick: () => void
}

export const Summary = ({
  city,
  country,
  riskStatus,
  articles,
  onBackButtonClick,
  ...props
}: Props) => {
  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex justify-between gap-4">
        <h3 className="text-3xl font-semibold text-slate-800">
          {city}, {country}
        </h3>
        <Button onClick={onBackButtonClick} Icon={X} />
      </div>
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-bold">Summary</h4>
        <p className="text-base font-normal">
          {riskStatus.has_risk ? riskStatus.risk_summary : "Status stable"}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {articles.map((article) => {
          return (
            <NewsCard
              key={article.summary}
              imagePath={article.imagePath}
              title={article.author}
              summary={article.summary}
              Icon={article.Icon}
              city={article.city}
              country={article.country}
            />
          )
        })}
      </div>
    </div>
  )
}
