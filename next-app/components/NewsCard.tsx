import { LucideIcon } from "lucide-react"
import { ComponentProps } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export interface NewsCardData {
  imagePath: string
  title: string
  summary: string
  Icon: LucideIcon
  city: string
  country: string
}

type Props = NewsCardData & ComponentProps<"div">

export const NewsCard = ({
  imagePath,
  title,
  summary,
  Icon,
  city,
  country,
  ...props
}: Props) => {
  return (
    <div
      {...props}
      className="flex flex-shrink-0 justify-between space-x-4 rounded-xl bg-white p-4 shadow-md"
    >
      <Avatar>
        <AvatarImage src={imagePath} />
        <AvatarFallback>VC</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="text-sm">{summary}</p>
        <div className="flex items-center pt-2">
          <Icon className="mr-2 h-4 w-4 opacity-70" />
          <span className="text-xs text-muted-foreground">
            {city}, {country}
          </span>
        </div>
      </div>
    </div>
  )
}
