import os


def parse_location_name(location):
    return f"{location['city']}, {location['country']}"


def get_system_prompt(location):
    location_name = parse_location_name(location)
    return f"""
You're an analyst for Outokumpu, a stainless steel manufacturer.
You're tasked with monitoring news articles for events that could impact the company's operations.
You have an important raw material supplier in {location_name}.
You monitor news articles for potentially disruptive events in {location_name}.
If there is an event that could impact the company's operations, you need to mention it in your report.
If the news don't contain important information, you MUST NOT mention it in your daily report.
For important information, the location must match {location_name} and the event must be important.
"""


def get_articles_for_location(location, articles, max_per_event=5):
    location_name = parse_location_name(location)
    return [a for a in articles if parse_location_name(a["location"]) == location_name][:max_per_event]


def get_query_prompt(articles):
    prompt = ""
    for article in articles:
        prompt += f"""
        Title: {article["name"]}
        Description: {article["description"]}
        URL: {article["url"]}
        """
    return prompt


def get_tool_for_location(location):
    location_name = parse_location_name(location)
    return [
        {
            "type": "function",
            "function": {
                "name": "report_risk_status",
                "description": f"Report the risk status for {location_name} based on the news articles. Information regarding the articles (article title & url) is given in the article parameters, not in the summary.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "has_risk": {
                            "type": "boolean",
                            "description": "Whether there is a potential risk for operations or not",
                        },
                        "risk_title": {
                            "type": "string",
                            "description": "Given if there is a risk. One sentence title for the risk for operations intended for analysts. For example: Potential disruption due to a labor strike in the region.",
                        },
                        "risk_summary": {
                            "type": "string",
                            "description": "Given if there is a risk. A few sentences summary for the risk for operations intended for analysts.",
                        },
                        "articles": {
                            "type": "array",
                            "description": "Given if there is a risk. Contains information of the articles that describe the risk. Very important to include if there is a risk.",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "title": {
                                        "type": "string",
                                        "description": "The title of the article",
                                    },
                                    "content": {
                                        "type": "string",
                                        "description": "The content of the article",
                                    },
                                    "url": {
                                        "type": "string",
                                        "description": "The URL of the article",
                                    },
                                },
                            },
                        },
                    },
                    "required": ["has_risk"],
                },
            },
        },
    ]


def get_prompts_for_location(location, articles):
    query_prompt = get_query_prompt(articles)
    system_prompt = get_system_prompt(location)
    tools = get_tool_for_location(location)
    return {
        "messages": [
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": query_prompt,
            },
        ],
        "tools": tools,
        "tool_choice": {"type": "function", "function": {"name": "report_risk_status"}},
    }
