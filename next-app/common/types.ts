export interface Article {
  title: string
  content: string
  url: string
}

export type RiskStatus =
  | {
      has_risk: true
      risk_title: string
      risk_summary: string
      articles: Article[]
    }
  | {
      has_risk: false
    }

export interface Factory {
  location: {
    coordinates: {
      lon: number
      lat: number
    }
    city: string
    country: string
  }
  risk_status: RiskStatus
}

export interface ServerResponse {
  factories: Factory[]
}
