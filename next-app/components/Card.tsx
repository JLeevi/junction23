import { ComponentProps, ReactNode } from "react"

interface Props extends ComponentProps<"div"> {
  children: ReactNode
}

export const Card = ({ children, ...props }: Props) => {
  return (
    <div {...props} className="rounded-md border border-slate-200 bg-white">
      {children}
    </div>
  )
}
