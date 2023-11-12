import Link from "next/link"
import { ComponentProps } from "react"

export interface NewsCardData {
  summary: string
  url: string
}

type Props = NewsCardData & ComponentProps<"div">

export const NewsCard = ({ summary, url, ...props }: Props) => {
  return (
    <div
      {...props}
      className="flex flex-shrink-0 justify-between space-x-4 rounded-lg border-2 bg-white p-4"
    >
      <div className="space-y-1">
        <p className="text-sm font-medium">{summary}</p>
        <div className="flex items-center pt-2">
          <Link href={url} className="text-xs text-muted-foreground">
            {url}
          </Link>
        </div>
      </div>
    </div>
  )
}
