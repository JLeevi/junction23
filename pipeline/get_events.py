import json
import os
from get_disaster_data import fetch_disaster_articles
from get_news import fetch_news_articles
from azure.storage.blob import BlobServiceClient
from queries import NEWS_QUERIES


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
