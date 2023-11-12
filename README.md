# Junction 2023 - SupplySignal

> Every once in a while, a revolutionary product comes along that changes everything. We call it *SupplySignal*

# SupplySignal

## Overview

Welcome to SupplySignal, your solution for proactive supply chain risk management. In today's intricate global business landscape, disruptions in the operations of even a single supplier can bring an entire production line to a standstill. SupplySignal empowers companies by providing continuous, timely, and relevant information on major events affecting raw material suppliers, enabling proactive adjustments to sourcing operations in the face of high risks.

## Problem Statement

In the traditional approach, staying informed about supplier-related events involves manual scrutiny of multiple global news feeds and data sources, a time-consuming process prone to delayed responses. SupplySignal tackles this challenge head-on by automating data retrieval, filtering pertinent information based on supplier locations and topics, employing a Language Model (LLM) for analysis, and presenting users with concise risk descriptions. Accessible through a user-friendly monitoring dashboard, SupplySignal ensures timely insights to optimize sourcing strategies.

Check out a demo of the SupplySignal monitoring dashboard [here](https://junction23-beige.vercel.app).

## Three Pillars of Development

### 1. Trustworthiness of Results

To guarantee the reliability of results, we implement rigorous measures:

- **Location and Topic-Wise Queries:** Results are sanitized through selective queries, focusing on supplier locations and predefined keywords. We can leverage domain knowledge to scan for risks in specific locations.
  
- **Augmented Information:** News articles are enriched with up-to-date global disaster information curated by reputable organizations like the United Nations and the European Union.
  
- **Source Transparency:** Claims made by the AI are backed by verifiable sources, ensuring trustworthiness. All conclusions are complemented by either news articles or GDACS reports.
  
- **Prompt Design:** The LLM utilizes a predefined and tested prompt to avoid hallucinations.

### 2. Efficiency of the Solution

SupplySignal excels in efficiency, outperforming traditional methods:

- **Batch Processing:** Filters vast amounts of news to a manageable batch (e.g., <10 articles per day) for LLM processing.
  
- **Geographically Pinpointed News:** Reduces search space by pinpointing news to relevant areas, streamlining information retrieval.
  
- **Keyword-Driven Topic Queries:** Precision in news topic queries using carefully defined keywords enhances the accuracy of relevant article identification.
  
- **Location-Wise Clustering:** Simultaneously processes batches of relevant news clustered by location, optimizing efficiency.
  
- **Modular Architecture:** The solution's modular architecture allows for easy LLM switching without disrupting the overall data pipeline.

### 3. User Experience

- The value we provide is based on providing information you can *act on*. Thus, it is important that the results are easily viewed and understood. Our dashboard aims to achieve just this.
- We value your feedback on the user experience. Try out the SupplySignal monitoring dashboard and share your opinions with us.

**Stay Ahead with SupplySignal - Because Proactive is Better than Reactive!**

---
