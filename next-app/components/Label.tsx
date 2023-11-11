import { type VariantProps, cva } from "class-variance-authority"
import { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export const styles = cva(
  "flex h-5 w-11 items-center justify-center rounded-full bg-red-500 px-3 py-0.5 text-xs font-bold leading-none text-white",
  {
    variants: {
      intent: {
        high: "bg-red-500",
        medium: "bg-yellow-500",
        low: "bg-green-500",
      },
    },
  },
)

interface Props extends ComponentProps<"div">, VariantProps<typeof styles> {}

export const Label = ({ intent, className, ...props }: Props) => {
  return <div {...props} className={cn(styles({ intent }), className)}></div>
}
