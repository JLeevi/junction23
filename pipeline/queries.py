
# Define each location and the events that we want to search for that location
# Each location is a production site or mine that we want to monitor
# Each event is a type of event that we want to monitor for that location
NEWS_QUERIES = [
    {
        "location": {
            "flag": "🇨🇴",
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
            "flag": "🇬🇹",
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
            "flag": "🇧🇷",
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
            "flag": "🇳🇱",
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
    },
    {
        "location": {
            "flag": "🇿🇼",
            "country": "Zimbabwe",
            "city": "Harare",
            "coordinates": {
                "lat": -17.805176546407868,
                "lon": 31.046041795875578,
            }
        },
        "events": [
            "natural disaster",
            "workers strike",
        ],
    },
    {
        "location": {
            "flag": "🇩🇪",
            "country": "Germany",
            "city": "Berlin",
            "coordinates": {
                "lat": 52.558715181258684,
                "lon": 13.50432896407948,
            }
        },
        "events": [
            "natural disaster",
            "workers strike",
        ],
    },
    {
        "location": {
            "flag": "🇹🇷",
            "country": "Turkey",
            "city": "Ankara",
            "coordinates": {
                "lat": 39.96018250478697,
                "lon": 32.863076953317126,
            }
        },
        "events": [
            "natural disaster",
            "workers strike",
        ],
    }
]
