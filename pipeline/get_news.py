import json
import os
import requests
from dotenv import load_dotenv

load_dotenv()

BING_KEY = os.environ["BING_SEARCH_V7_SUBSCRIPTION_KEY"]
BING_API_ENDPOINT = os.environ["BING_SEARCH_V7_ENDPOINT"]


def get_news_for_query(query="", count=100):
    headers = {"Ocp-Apim-Subscription-Key": BING_KEY}
    params = {"mkt": "en-US", "q": query, "count": count, "sortBy": "Date"}
    response = requests.get(BING_API_ENDPOINT, headers=headers, params=params)
    response.raise_for_status()
    news_articles = response.json()
    return news_articles


def fetch_news_articles(queries):
    all_articles = []
    for query in queries:
        for event in query["events"]:
            country = query["location"]["country"]
            city = query["location"]["city"]
            q = f"{event} {city} {country}"
            news_articles = get_news_for_query(query=q)
            for article in news_articles["value"]:
                all_articles.append(
                    {
                        "location": query["location"],
                        "event": event,
                        "name": article["name"],
                        "url": article["url"],
                        "description": article["description"],
                        "timestamp": article["datePublished"]
                    }
                )
    return all_articles
