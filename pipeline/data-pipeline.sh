#!/bin/bash

source venv/bin/activate

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Fetching news and disaster events...${NC}"
python get_events.py
echo -e "${GREEN}Done!${NC}"

echo -e "${BLUE}Generating risk analysis...${NC}"
python get_events.py
echo -e "${GREEN}Done!${NC}"

echo -e "${YELLOW}Pipeline completed${NC}"
