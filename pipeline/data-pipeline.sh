#!/bin/bash

echo "Fetching news data..."
python fetch-news-api.py

echo "Fetcing disaster data..."
python fetch-disaster-data.py

echo "Script completed."