#!/bin/bash

echo "Fetching news data..."
poetry run python fetch-news-data.py

echo "Fetcing disaster data..."
poetry run python fetch-disaster-data.py

echo "Script completed."