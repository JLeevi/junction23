import datetime
import os
import streamlit as st
import json
import subprocess
from dotenv import load_dotenv
from queries import NEWS_QUERIES

load_dotenv()


def save_to_json(title, content, location, url):
    # Get timestamp from current time
    timestamp = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
    data = [{
        "name": title,
        "description": content,
        "location": location,
        "url": url,
        "timestamp": timestamp
    }]

    output_location = os.environ["LOCAL_NEWS_STORAGE_LOCATION"]
    with open(output_location, 'w') as f:
        # dump with indent=4 for pretty printing
        json.dump(data, f, indent=4)


def run_sh_script():
    # Run the data-pipeline.sh in this same folder
    # with the DEMO flag set to True
    # i.e. DEMO=True ./data-pipeline.sh

    # Get the current working directory
    cwd = os.getcwd()
    # Get the path to the data-pipeline.sh script
    script_path = os.path.join(cwd, "data-pipeline.sh")
    # Run the script with the DEMO flag set to True
    subprocess.run([script_path], env={'DEMO': 'True'})


def get_location_keys():
    keys = []
    # Loop through locations and add key, value pairs
    # where key is the locations flag, country and city
    # and key is the full location object

    for query in NEWS_QUERIES:
        location = query["location"]
        key = f"{location['flag']} {location['city']}, {location['country']}"
        keys.append(key)
    return keys


def get_location_for_key(key):
    for query in NEWS_QUERIES:
        location = query["location"]
        location_key = f"{location['flag']} {location['city']}, {location['country']}"
        if location_key == key:
            return location
    return None


def main():

    st.title("Add A News Article")

    # Text input for article title
    title = st.text_input("Enter Article Title:")

    # Text input for article content
    content = st.text_area("Enter Article Content:")

    # Text input for article url
    url = st.text_input("Enter Article Url:")

    # Selection input for choosing a location
    location_options = get_location_keys()
    location_key = st.selectbox("Select Location:", location_options)

    # Get location object from key
    location = get_location_for_key(location_key)

    # Submit button to save to JSON
    if st.button("Submit"):
        save_to_json(title, content, location, url)
        st.success("Article submitted successfully!")

    # Button to run local sh file
    if st.button("Run data pipeline"):
        with st.spinner("Executing data pipeline..."):
            run_sh_script()
        st.success("Script executed successfully!")


if __name__ == '__main__':
    main()
