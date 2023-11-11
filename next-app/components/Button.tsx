import { LucideIcon } from "lucide-react"
import { ComponentProps } from "react"

interface Props extends ComponentProps<"button"> {
  Icon: LucideIcon
}

export const Button = ({ Icon, ...props }: Props) => {
  return (
    <button
      {...props}
      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border-2 border-slate-200 bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 active:border-slate-300 active:bg-slate-300"
    >
      <Icon />
    </button>
  )
}
