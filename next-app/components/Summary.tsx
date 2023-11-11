import { ComponentProps } from "react"

interface Props extends ComponentProps<"div"> {
  city: string
  country: string
  summaries: string[]
}

export const Summary = () => {
  return <h4></h4>
}
