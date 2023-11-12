import { type NextRequest, NextResponse } from "next/server"

//
export async function POST(request: NextRequest) {
  const apikey = process.env.SMS_PROVIDER_API_KEY
  const SMS_PHONE_NUMBER = process.env.SMS_PHONE_NUMBER
  if (!apikey)
    throw new Error("SMS_PROVIDER_API_KEY environment variable is missing")
  if (!SMS_PHONE_NUMBER)
    throw new Error("SMS_PHONE_NUMBER environment variable is missing")

  const auth = Buffer.from(apikey).toString("base64")

  console.log({ apikey })

  const body = await request.json()
  const eventDescription = body.eventDescription as string

  const data = {
    from: "Signal",
    to: SMS_PHONE_NUMBER,
    message: eventDescription,
  }

  const queryParams = new URLSearchParams(data)

  const res = await fetch("https://api.46elks.com/a1/sms", {
    method: "post",
    body: queryParams.toString(),
    headers: { Authorization: "Basic " + auth },
  })

  // Read res.body and log the contents
  const bodyText = await res.text()
  console.log({ bodyText, SMS_PHONE_NUMBER })

  return NextResponse.json({ success: true })
}
