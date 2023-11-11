import { ComponentProps } from "react"

import { Card, CardData } from "./Card"

interface Props extends ComponentProps<"div"> {
  cardData: CardData[]
}

export const NewsFeed = ({ cardData, ...props }: Props) => {
  return (
    <div className="relative">
      <div
        {...props}
        className="hidden-scrollbar linear fade-sides flex w-full gap-4 overflow-x-auto px-2 py-4"
      >
        {cardData.map((card) => (
          <Card {...card} />
        ))}
      </div>
      <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-slate-50 to-transparent"></div>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-slate-50 to-transparent"></div>
    </div>
  )
}