import Link from "next/link"
import { ComponentProps } from "react"

export interface NewsCardData {
  summary: string
  url: string
}

type Props = NewsCardData & ComponentProps<"div">

export const NewsCard = ({ summary, url, ...props }: Props) => {
  return (
    <Link href={url}>
      <div
        {...props}
        className="flex flex-shrink-0 justify-between space-x-4 rounded-lg border-2 bg-white p-4 transition-all hover:border-slate-300"
      >
        <div className="space-y-1">
          <p className="text-sm font-medium">{summary}</p>
          <div className="flex items-center pt-2 text-xs text-muted-foreground ">
            {url}
          </div>
        </div>
      </div>
    </Link>
  )
}
