
import json
import math
from runModel import giveRating
import requests
import os
import subprocess
import sys


def runPolitBertOnText(text):
    return giveRating(text)


def extract_name(url):
    file_name = url.split("/")[-1]
    return file_name


def runPolitBertOnImage(image_url):
    res = requests.get(image_url)

    save_path = os.path.join(
        "ml/googleVision/sample images", extract_name(image_url))

    with open(save_path, 'wb') as f:
        f.write(res.content)

    result = subprocess.run(
        ["python", "ml/googleVision/visionExecutable.py", save_path], capture_output=True, text=True)

    # Print the output for demonstration purposes
    # print("Output from visionExecutable.py:", result.stdout.strip())

    text = result.stdout.strip()
    rating = runPolitBertOnText(text)
    return rating


def check_json_attributes(json_object):
    # Check if 'content' attribute is present and not empty
    if 'content' in json_object and json_object['content'] and 'image' in json_object and json_object['image']:
        ratingText = runPolitBertOnText(json_object['content'])
        ratingImage = runPolitBertOnImage(json_object['image'])
        overallRating = math.floor(ratingText + ratingImage/2)
        json_object['rating'] = overallRating

    elif 'content' in json_object and json_object['content']:
        ratingText = runPolitBertOnText(json_object['content'])
        overallRating = ratingText
        json_object['rating'] = overallRating

    # Check if 'image' attribute is present and not empty
    elif 'image' in json_object and json_object['image']:
        ratingImage = runPolitBertOnImage(json_object['image'])
        overallRating = ratingImage
        json_object['rating'] = overallRating

    else:
        print("Post contains no contents")

    return json_object

    # print(json_object)
if __name__ == "__main__":
    # Read the JSON data from standard input
    json_data = sys.stdin.read()

    # Process the JSON data
    processed_json = check_json_attributes(json_data)

    if processed_json:
        # Print the processed JSON to standard output
        print(json.dumps(processed_json))

# Example JSON object
# example_json = {
#     "_id": "65bf0bf67ee9301da6538fe1",
#     "content": "test",
#     "image": "",
#     "user": {
#         "_id": "65bf08f8725afb2ce0b28b27",
#         "name": "assadtest",
#         "username": "test",
#         "password": "$2a$10$m6wPBGWM9wWzOKHdeRB9NeUZaInj8LGByFr4SnQ0IRdVTmbzXYS9S",
#         "profilePicUrl": "https://utfs.io/f/316b3533-39b9-4bdd-a268-4a162e812c30-1jqe77.jpg",
#         "following": [],
#         "followers": [],
#         "posts": ["Array"],
#         "v": 1
#     },
#     "likes": [],
#     "comments": [],
#     "timestamp": "2024-02-04T04:00:54.676Z",
#     "v": 0
# }

# example_json_without_rating = {
#     "_id": "65bf17c17ee9301da653919c",
#     "content": "I love the sky",
#     "image": "https://utfs.io/f/d1498195-e93b-4697-b81f-1eed5d63af7e-1jqe77.jpg",
#     "user": {
#         "_id": "65bf08f8725afb2ce0b28b27",
#         "name": "assadtest",
#         "username": "test",
#         "password": "$2a$10$m6wPBGWM9wWzOKHdeRB9NeUZaInj8LGByFr4SnQ0IRdVTmbzXYS9S",
#         "profilePicUrl": "https://utfs.io/f/316b3533-39b9-4bdd-a268-4a162e812c30-1jqe77.jpg",
#         "following": [],
#         "followers": ["Array"],
#         "posts": ["Array"],
#         "v": 8
#     },
#     "likes": [],
#     "comments": [],
#     "timestamp": "2024-02-04T04:51:13.858Z",
#     "v": 0
# }

# # Call the function with the example JSON object
# check_json_attributes(example_json_without_rating)
