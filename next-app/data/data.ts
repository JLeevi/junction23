import { Factory } from "lucide-react"

import { Factory as FactoryType } from "@/common/types"
import { NewsCardData } from "@/components/NewsCard"

export const factories: FactoryType[] = [
  {
    location: {
      country: "Colombia",
      city: "Bogota",
      coordinates: {
        lat: 4.678390790414742,
        lon: -74.08310452775451,
      },
    },
    risk_status: {
      has_risk: false,
    },
  },
  {
    location: {
      country: "Guatemala",
      city: "El Estor",
      coordinates: {
        lat: 15.5322197047923,
        lon: -89.33265507494376,
      },
    },
    risk_status: {
      has_risk: false,
    },
  },
  {
    location: {
      country: "Brazil",
      city: "Onca Puma",
      coordinates: {
        lat: -6.605335306591729,
        lon: -51.100066887737015,
      },
    },
    risk_status: {
      has_risk: true,
      risk_title: "Potential disruption due to a labor strike in the region.",
      risk_summary:
        "The union representing mining workers in Onca Puma has called for a strike. This could lead to disruptions in the supply of raw materials for the company's operations.",
      articles: [
        {
          title: "Factory workers' union calls for strike in Onca Puma",
          content:
            "The union representing mining workers in Onca Puma has called for a strike.",
          url: "https://fakeurl.com/workers-strike",
        },
      ],
    },
  },
  {
    location: {
      country: "Holland",
      city: "Terneuzen",
      coordinates: {
        lat: 51.33013942257549,
        lon: 3.83565678442852,
      },
    },
    risk_status: {
      has_risk: false,
    },
  },
]

export const cardData: NewsCardData[] = [
  {
    imagePath: "/logos/bloomberg.png",
    title: "Bloomberg",
    summary: "Someone was killed",
    Icon: Factory,
    city: "New York",
    country: "United States",
  },
  {
    imagePath: "/logos/bloomberg.png",
    title: "Bloomberg",
    summary: "Someone was killed",
    Icon: Factory,
    city: "New York",
    country: "United States",
  },
  {
    imagePath: "/logos/bloomberg.png",
    title: "Bloomberg",
    summary: "Someone was killed",
    Icon: Factory,
    city: "New York",
    country: "United States",
  },
  {
    imagePath: "/logos/bloomberg.png",
    title: "Bloomberg",
    summary: "Someone was killed",
    Icon: Factory,
    city: "New York",
    country: "United States",
  },
  {
    imagePath: "/logos/bloomberg.png",
    title: "Bloomberg",
    summary: "Someone was killed",
    Icon: Factory,
    city: "New York",
    country: "United States",
  },
]
