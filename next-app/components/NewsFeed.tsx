import { ComponentProps } from "react"

import { Card, CardData } from "./Card"

interface Props extends ComponentProps<"div"> {
  cardData: CardData[]
}

export const NewsFeed = ({ cardData, ...props }: Props) => {
  return (
    <div
      {...props}
      className="hidden-scrollbar flex w-full gap-4 overflow-x-auto py-4"
    >
      {cardData.map((card) => (
        <Card {...card} />
      ))}
    </div>
  )
}
