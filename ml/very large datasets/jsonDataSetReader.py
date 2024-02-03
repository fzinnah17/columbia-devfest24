# Python program to read
# json file - credit to https://www.geeksforgeeks.org/read-json-file-using-python/

import json
import csv
# Opening JSON file
# CHANGE THIS WHEN NEEDED
f = open('ml/very large datasets (too big)/dataset.json')

# returns JSON object as
# a dictionary
data = json.load(f)

# Iterating through the json
# list

descriptionArray = []
labelsArray = []

for x in range(0, len(data)):

    description = data[x]['snippet']['description']

    bias1 = ""
    if data[x]['bias'] == "extremeleft":
        bias1 = "very liberal"
    elif data[x]['bias'] == "left":
        bias1 = "liberal"
    elif data[x]['bias'] == "leastbiased":
        bias1 = "neutral"
    elif data[x]['bias'] == "right":
        bias1 = "conservative"
    elif data[x]['bias'] == "extremeright":
        bias1 = "very conservative"
    descriptionArray.append(description)
    labelsArray.append(bias1)


# Closing file

print(descriptionArray)
print(labelsArray)

print(len(labelsArray))
print(len(descriptionArray))

with open('datafile.csv', 'a') as f:
    write = csv.writer(f)
    write.writerow(descriptionArray)

with open('labels.csv', 'a') as d:
    write2 = csv.writer(d)
    write2.writerow(labelsArray)


f.close()
