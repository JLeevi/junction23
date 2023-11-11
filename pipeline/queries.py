
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
