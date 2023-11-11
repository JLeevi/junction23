# Data Processing Pipeline

## Overview

This folder contains a comprehensive data processing pipeline designed to fetch and process news and disaster data, generate risk assessments using GPT.
The assessments are pushed into a blob. A web app fetches the blob and displays
the results in a dashboard.

## Contents

The pipeline is divided into two main parts:

### PART 1 - Data Fetching and Processing

1. **Fetching the News**

   - Retrieve the latest news data relevant to the project.
   - Source for news is Bing News API

2. **Fetching the Disaster Data**

   - Collect disaster-related data to be used in the analysis.
   - Source for disaster data is `www.gdacs.org`

3. **Processing Data into Event-Sources**

   - Combine and process the fetched news and disaster data into a unified event-source for each location or production site.

4. **Storing Results in a Blob**
   - Save the processed event-sources in a storage blob for easy retrieval.

### PART 2 - Producing Risk Assessments

1. **Fetching Event-Source from Blob**

   - Retrieve the event-sources stored in the blob from Part 1.

2. **Generating Risk Assessments**

   - Utilize a language model to analyze the events for each location and produce comprehensive risk assessments.
   - If the news or disaster data contain evidence for potential disruption of operations, the model should elevate that as a risk, along with the original source on which the analysis is based on.
   - For example, if there is a planned labor strike of mining workers in Bogota, Colombia, the model should elevate that as a risk, as there is an important raw-material supplier of Outokumpu in Bogota.
   - Currently, the LLM used is `GPT-3.5-turbo`
   - This block is easily changeable to another LLM provider.
   - `GPT-3.5-turbo` is powerful enough to provide accurate summaries, but small enough to not consume resources inefficiently.

3. **Storing Results in a Blob**
   - Save the generated risk assessments in a storage blob for easy access.

### Web App Integration

- The web app fetches risk assessments from the blob and displays them in an intuitive dashboard.
