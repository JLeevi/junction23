import json
import os
from dotenv import load_dotenv
from openai import OpenAI
from queries import NEWS_QUERIES
from prompt_tools import get_prompts_for_location, get_articles_for_location
from azure.storage.blob import BlobServiceClient


load_dotenv()

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
MODEL_ID = "gpt-3.5-turbo-1106"
openai_client = OpenAI(api_key=OPENAI_API_KEY)
EVENTS_JSON_LOCATION = "data/events.json"
RISK_STATUS_JSON_LOCATION = "data/risk_status.json"


def get_completion_for_location(location, articles):
    articles = get_articles_for_location(location, articles)
    prompts = get_prompts_for_location(location, articles)
    completion = openai_client.chat.completions.create(
        messages=prompts["messages"],
        tools=prompts["tools"],
        tool_choice=prompts["tool_choice"],
        model=MODEL_ID,
        max_tokens=500,
        temperature=0.3
    )
    return completion


def parse_risk_status_from_completion(completion):
    try:
        return json.loads(completion.choices[0].message.tool_calls[0].function.arguments)
    except Exception as e:
        print(f"------\nError parsing risk status: {e}")
        print(f"Related completion: {completion}------\n")
        return {"has_risk": False}


def main():
    connection_string = os.environ["BLOB_CONNECTION_STRING"]
    blob_service_client = BlobServiceClient.from_connection_string(
        connection_string)
    blob_client = blob_service_client.get_blob_client(
        container="llm-input", blob="events.json")
    with open(EVENTS_JSON_LOCATION, mode="wb") as file:
        download_stream = blob_client.download_blob()
        file.write(download_stream.readall())

    risk_statuses = []
    print(f"Loading events from {EVENTS_JSON_LOCATION}...")
    with open(EVENTS_JSON_LOCATION, "r") as json_file:
        all_events = json.load(json_file)

    print("Generating risk statuses...")
    for query in NEWS_QUERIES:
        completion = get_completion_for_location(query["location"], all_events)
        risk_status = parse_risk_status_from_completion(completion)
        risk_statuses.append({
            "location": query["location"],
            "risk_status": risk_status
        })

    print("Saving risk statuses...")
    with open(RISK_STATUS_JSON_LOCATION, "w") as json_file:
        json.dump(risk_statuses, json_file, indent=4)
    print(f"Risk statuses saved to {RISK_STATUS_JSON_LOCATION}")
    blob_client = blob_service_client.get_blob_client(
        container="web-input", blob=f"risk_status.json")
    with open(file=RISK_STATUS_JSON_LOCATION, mode="rb") as data:
        blob_client.upload_blob(data, overwrite=True)


if __name__ == "__main__":
    main()
