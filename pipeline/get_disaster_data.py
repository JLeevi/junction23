import requests
from geopy.distance import geodesic
import xml.etree.ElementTree as ET
from datetime import datetime

API_URL = "https://www.gdacs.org/xml/rss.xml"

def calculate_distance(lat1, lon1, lat2, lon2):
    coords1 = (lat1, lon1)
    coords2 = (lat2, lon2)
    return geodesic(coords1, coords2).kilometers

def is_relevant_event_for_location(event_lat, event_lon, alert_level, location):
    """Checks if the event is happening close to location. Closeness depends on 
    alert level.
    """
    location_lat = location["coordinates"]["lat"]
    location_lon = location["coordinates"]["lon"]
    distance = calculate_distance(
        location_lat, location_lon, event_lat, event_lon)
    if alert_level == "Green" and distance < 100:
        return True
    elif alert_level == "Orange" and distance < 1000:
        return True
    elif alert_level == "Red" < 10000:
        return True
    else:
        return False

def parse_events_from_disaster_xml(locations, content_xml):
    root = ET.fromstring(content_xml)
    result_data = []
    for item in root.findall('.//item'):
        title = item.find('./title').text
        description = item.find('./description').text
        pub_date_raw = item.find('./pubDate').text
        date = datetime.strptime(
            pub_date_raw, "%a, %d %b %Y %H:%M:%S %Z").strftime("%Y-%m-%dT%H:%M:%SZ")
        geo_namespaces = {'geo': "http://www.w3.org/2003/01/geo/wgs84_pos#"}
        gdacs_namespace = {'gdacs': "http://www.gdacs.org"}
        point = item.find('.//geo:Point', geo_namespaces)
        event_lat = point.find('./geo:lat', geo_namespaces).text
        event_lon = point.find('./geo:long', geo_namespaces).text
        alert_level = item.find('./gdacs:alertlevel', gdacs_namespace).text

        result_json = {
            "title": title,
            "description": description,
            "timestamp": date,
            "locations_affected": [],
            "url": API_URL
        }

        for location in locations:
            if is_relevant_event_for_location(event_lat, event_lon, alert_level, location):
                result_json["locations_affected"].append(location)

        # Only add disasters that are affecting specified locations
        if len(result_json["locations_affected"]) > 0:
            result_data.append(result_json)
    return result_data
 
def generate_articles_for_disaster(disaster):
    """Generates articles for each location affected by a single disaster.
    Formatted similar to news articles.
    """
    articles = []
    for location in disaster["locations_affected"]:

        event = "natural disaster"
        articles.append(
            {
                "location": location,
                "event": event,
                "name": disaster["title"],
                "url": disaster["url"],
                "description": disaster["description"],
                "timestamp": disaster["timestamp"]
            }
        )
    return articles

def fetch_disaster_articles(locations):
    """Fetches disaster articles from GDACS.
    Returns a list of articles formatted similar to news articles
    """
    response = requests.get(API_URL)
    content_xml = response.content.decode("utf-8")
    disasters = parse_events_from_disaster_xml(locations, content_xml)
    articles = []
    for disaster in disasters:
        articles.extend(generate_articles_for_disaster(disaster))
    return articles
