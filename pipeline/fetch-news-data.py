import os
import json
import requests
from dotenv import load_dotenv
import hashlib
from azure.storage.blob import BlobServiceClient


def get_news_articles(endpoint, headers, params):
    response = requests.get(endpoint, headers=headers, params=params)
    response.raise_for_status()
    return response.json()

def main():
    load_dotenv()
    subscription_key = os.environ["BING_SEARCH_V7_SUBSCRIPTION_KEY"]
    bing_endpoint = os.environ["BING_SEARCH_V7_ENDPOINT"]
    event = os.environ["EVENT"]
    location = os.environ["LOCATION"]
    connection_string = os.environ["BLOB_CONNECTION_STRING"]

    headers = {"Ocp-Apim-Subscription-Key": subscription_key}
    count = 100
    params = {"mkt": "en-US", "q": f"{event} {location}", "count": count, "sortBy": "Date"}

    news_articles = get_news_articles(bing_endpoint, headers, params)
    result_data = {"articles": []}
    for article in news_articles["value"]:
        sha256 = hashlib.sha256()
        sha256.update(article["url"].encode("utf-8"))
        result_json = {
            "id": sha256.hexdigest(),
            "url": article["url"],
            "content": f"{article['name']}. {article['description']}",
            "publisher": article["provider"][0]["name"],
            "location": location,
            "date": article["datePublished"],
            "key": event
        }
        result_data["articles"].append(result_json)
    
    with open("data.json", 'w') as json_file:
        json.dump(result_data, json_file)
    
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    blob_client = blob_service_client.get_blob_client(container="news-data", blob=f"data1.json")
    with open(file="data.json", mode="rb") as data:
        blob_client.upload_blob(data, overwrite=True)


if __name__ == "__main__":
    main()
