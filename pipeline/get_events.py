import json
import os
from get_disaster_data import fetch_disaster_articles
from get_news import fetch_news_articles
from azure.storage.blob import BlobServiceClient


# Define each location and the events that we want to search for that location
# Each location is a production site or mine that we want to monitor
# Each event is a type of event that we want to monitor for that location
NEWS_QUERIES = [
    {
        "location": {
            "country": "Colombia",
            "city": "Bogota",
            "coordinates": {
                "lat": 4.678390790414742,
                "lon": -74.08310452775451,
            }
        },
        "events": [
            "natural disaster",
            "workers strike",
        ],
    },
    {
        "location": {
            "country": "Guatemala",
            "city": "El Estor",
            "coordinates": {
                "lat": 15.5322197047923,
                "lon": -89.33265507494376,
            }
        },
        "events": [
            "natural disaster",
            "workers strike",
        ],
    },
    {
        "location": {
            "country": "Brazil",
            "city": "Onca Puma",
            "coordinates": {
                "lat": -6.605335306591729,
                "lon": -51.100066887737015,
            }
        },
        "events": [
            "natural disaster",
            "workers strike",
        ],
    },
    {
        "location": {
            "country": "Holland",
            "city": "Terneuzen",
            "coordinates": {
                "lat": 51.33013942257549,
                "lon": 3.83565678442852,
            }
        },
        "events": [
            "natural disaster",
            "workers strike",
        ],
    }
]


def main():
    connection_string = os.environ["BLOB_CONNECTION_STRING"]
    locations = [query["location"] for query in NEWS_QUERIES]
    news_articles = fetch_news_articles(NEWS_QUERIES)
    disaster_articles = fetch_disaster_articles(locations)
    all_events = disaster_articles + news_articles
    with open("data/events.json", "w") as json_file:
        json.dump(all_events, json_file, indent=4)
    
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    blob_client = blob_service_client.get_blob_client(container="llm-input", blob=f"events.json")
    with open(file="data/events.json", mode="rb") as data:
        blob_client.upload_blob(data, overwrite=True)


if __name__ == "__main__":
    main()
