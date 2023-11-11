import xml.etree.ElementTree as ET
import requests
import json
import os
from dotenv import load_dotenv
from datetime import datetime
from azure.storage.blob import BlobServiceClient
from geopy.distance import geodesic


def calculate_distance(lat1, lon1, lat2, lon2):
    coords1 = (lat1, lon1)
    coords2 = (lat2, lon2)
    return geodesic(coords1, coords2).kilometers

def parse_xml(content_xml, locations, url):
    root = ET.fromstring(content_xml)
    result_data = {"alert_data": []}
    for item in root.findall('.//item'):
        title = item.find('./title').text
        description = item.find('./description').text
        pub_date_raw = item.find('./pubDate').text
        date = datetime.strptime(pub_date_raw, "%a, %d %b %Y %H:%M:%S %Z").strftime("%Y-%m-%dT%H:%M:%SZ")
        point = item.find('.//geo:Point', namespaces={'geo': 'http://www.w3.org/2003/01/geo/wgs84_pos#'})
        lat = point.find('./geo:lat', namespaces={'geo': 'http://www.w3.org/2003/01/geo/wgs84_pos#'}).text
        lon = point.find('./geo:long', namespaces={'geo': 'http://www.w3.org/2003/01/geo/wgs84_pos#'}).text
        alert_level = item.find('./gdacs:alertlevel', namespaces={'gdacs': 'http://www.gdacs.org'}).text
        alert_score = item.find('./gdacs:alertscore', namespaces={'gdacs': 'http://www.gdacs.org'}).text
        calculation_type = item.find('./gdacs:calculationtype', namespaces={'gdacs': 'http://www.gdacs.org'}).text
        severity_level = item.find('./gdacs:severity', namespaces={'gdacs': 'http://www.gdacs.org'}).get('value')
        country = item.find('./gdacs:country', namespaces={'gdacs': 'http://www.gdacs.org'}).text

        result_json = {
            "description": f"{title}. {description}",
            "date": date,
            "location": {"lat": lat, "lon": lon},
            "alert_level": alert_level,
            "alert_score": alert_score,
            "calculation_type": calculation_type,
            "severity_level": severity_level,
            "country": country,
            "locations_affected": [],
            "source": url
        }

        for location in locations:
            distance = calculate_distance(location["lat"], location["lon"], lat, lon)
            if alert_level == "Green" and distance < 100:
                result_json["locations_affected"].append(location["name"])
            elif alert_level == "Orange" and distance < 1000:
                result_json["locations_affected"].append(location["name"])
            elif alert_level == "Red" < 10000:
                result_json["locations_affected"].append(location["name"])

        result_data["alert_data"].append(result_json)
    return result_data

def main():
    load_dotenv()
    connection_string = os.environ["BLOB_CONNECTION_STRING"]
    locations = [
        {"name": "El Estor", "lat": "15.5322197047923", "lon": "-89.33265507494376"},
        {"name": "Bogota", "lat": "4.678390790414742", "lon": "-74.08310452775451"},
        {"name": "Onca Puma", "lat": "-6.605335306591729", "lon": "-51.100066887737015"},
        {"name": "Terneuzen", "lat": "51.33013942257549", "lon": "3.83565678442852"},
    ]
    url = "https://www.gdacs.org/xml/rss.xml"
    response = requests.get(url)
    content_xml = response.content.decode("utf-8")
    result_data = parse_xml(content_xml, locations, url)

    with open("data.json", 'w') as json_file:
        json.dump(result_data, json_file)
    
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    blob_client = blob_service_client.get_blob_client(container="disaster-data", blob=f"disasters.json")
    with open(file="data.json", mode="rb") as data:
        blob_client.upload_blob(data, overwrite=True)


if __name__ == "__main__":
    main()