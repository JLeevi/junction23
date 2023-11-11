import { type VariantProps, cva } from "class-variance-authority"
import { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export const intent = {
  rank_10: "bg-green-500 text-white",
  rank_9: "bg-green-400 text-white",
  rank_8: "bg-green-200 text-slate-800",
  rank_7: "bg-yellow-200 text-slate-800",
  rank_6: "bg-yellow-400 text-white",
  rank_5: "bg-orange-400 text-white",
  rank_4: "bg-orange-500 text-white",
  rank_3: "bg-red-500 text-white",
  rank_2: "bg-red-700 text-white",
  rank_1: "bg-red-800 text-white",
}

export const styles = cva(
  "flex h-5 w-11 items-center justify-center rounded-full bg-red-500 px-3 py-0.5 text-xs font-bold leading-none",
  {
    variants: {
      intent,
    },
  },
)

interface Props extends ComponentProps<"div">, VariantProps<typeof styles> {
  score: number
}

export const Label = ({ score, intent, className, ...props }: Props) => {
  return (
    <div {...props} className={cn(styles({ intent }), className)}>
      {score}
    </div>
  )
}
