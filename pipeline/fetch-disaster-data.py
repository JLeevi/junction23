import xml.etree.ElementTree as ET
import requests
import json
import os
from dotenv import load_dotenv
from datetime import datetime
from azure.storage.blob import BlobServiceClient


def parse_xml(content_xml):
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
            "country": country
        }
        result_data["alert_data"].append(result_json)
    return result_data

def main():
    load_dotenv()
    connection_string = os.environ["BLOB_CONNECTION_STRING"]
    url = "https://www.gdacs.org/xml/rss.xml"
    response = requests.get(url)
    content_xml = response.content.decode("utf-8")
    result_data = parse_xml(content_xml)

    with open("data.json", 'w') as json_file:
        json.dump(result_data, json_file)
    
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    blob_client = blob_service_client.get_blob_client(container="disaster-data", blob=f"disasters.json")
    with open(file="data.json", mode="rb") as data:
        blob_client.upload_blob(data, overwrite=True)


if __name__ == "__main__":
    main()