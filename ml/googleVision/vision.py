
# Imports the Google Cloud client library
from google.cloud import vision


# <-change this parameter so that it takes in an image name

def run_quickstart(name) -> vision.EntityAnnotation:
    """Provides a quick start example for Cloud Vision."""

    # Instantiates a client
    client = vision.ImageAnnotatorClient()

    # The URI of the image file to annotate
    # file_uri = "gs://cloud-samples-data/vision/label/wakeupcat.jpg"

    # Replace this with one of the google cloud
    file_uri = "gs://devfest-image-bucket-v1/{}".format(name)

    image = vision.Image()
    image.source.image_uri = file_uri

    # Performs label detection on the image file
    response = client.label_detection(image=image)
    labels = response.label_annotations

    # print("Labels:")
    # for label in labels:
    #     print(label.description)

    return labels
