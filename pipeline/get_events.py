import json
import os
from get_disaster_data import fetch_disaster_articles
from get_news import fetch_news_articles
from azure.storage.blob import BlobServiceClient
from queries import NEWS_QUERIES


def main():
    connection_string = os.environ["BLOB_CONNECTION_STRING"]
    local_news_file = os.environ["LOCAL_NEWS_STORAGE_LOCATION"]
    is_demo = os.environ.get("DEMO") == "True"
    locations = [query["location"] for query in NEWS_QUERIES]
    news_articles = fetch_news_articles(NEWS_QUERIES)
    disaster_articles = fetch_disaster_articles(locations)
    all_events = disaster_articles + news_articles

    # If running with DEMO flag, also add locally added news stories
    if is_demo:
        with open(local_news_file, "r") as json_file:
            local_news = json.load(json_file)
        if (len(local_news) > 0):
            print(f"Adding {len(local_news)} local news stories to events")
            all_events = local_news + all_events

    # Write events to a local file
    with open("data/events.json", "w") as json_file:
        json.dump(all_events, json_file, indent=4)

    # Write events to a blob
    blob_service_client = BlobServiceClient.from_connection_string(
        connection_string)
    blob_client = blob_service_client.get_blob_client(
        container="llm-input", blob=f"events.json")
    with open(file="data/events.json", mode="rb") as data:
        blob_client.upload_blob(data, overwrite=True)


if __name__ == "__main__":
    main()
