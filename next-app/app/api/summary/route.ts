import type { NextRequest } from "next/server"

import { BlobServiceClient } from "@azure/storage-blob"

// Define the handler for your API route
export async function GET(request: NextRequest) {
  try {
    // Extract parameters from the request, if needed
    // For example, const { containerName, blobName } = request.query;

    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
    if (!connectionString) {
      throw new Error(
        "AZURE_STORAGE_CONNECTION_STRING environment variable is missing",
      )
    }

    // Define your Azure Blob fetch function here (or import it if it's defined elsewhere)

    const data = await fetchDataFromBlobStorage("web-input", "risk_status.json")

    // Return the fetched data as JSON
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as any).message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

async function fetchDataFromBlobStorage(
  containerName: string,
  blobName: string,
) {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!connectionString) {
    throw new Error(
      "AZURE_STORAGE_CONNECTION_STRING environment variable is missing",
    )
  }
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString)
  const containerClient = blobServiceClient.getContainerClient(containerName)
  const blobClient = containerClient.getBlobClient(blobName)

  const downloadBlockBlobResponse = await blobClient.download(0)

  // Assuming the blob's content is text, not binary
  if (!downloadBlockBlobResponse.readableStreamBody) {
    throw new Error("No readableStreamBody")
  }

  const downloaded = await streamToString(
    downloadBlockBlobResponse.readableStreamBody as any,
  )
  return JSON.parse(downloaded as any)
}

// A helper function used to read a ReadableStream into a string
async function streamToString(readableStream: ReadableStream) {
  return new Promise((resolve, reject) => {
    const chunks: string[] = []
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    readableStream.on("data", (data) => {
      chunks.push(data.toString())
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    readableStream.on("end", () => {
      resolve(chunks.join(""))
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    readableStream.on("error", reject)
  })
}

export const fetchCache = "force-no-store"
