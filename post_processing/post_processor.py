
import json
from runModel import giveRating


def runPolitBertOnText(text):
    return giveRating(text)

# def runPolitBertOnImage(image):


postTextContents = "The state of France"

text = True
image = False

if text and not image:
    ratingText = runPolitBertOnText(postTextContents)
    print(ratingText)


# elif text == "false" and image = "false":
#   ratingImage = runPolitBertOnImage(imageplaceholder)
# elif text == "true" and image = "true":
#   ratingText = runPolitBertOnText(textplaceholder)
#   ratingImage = runPolitBertOnImage(imageplaceholder)
