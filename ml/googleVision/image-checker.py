# this file checks if ceratin images are already in the Google Cloud bucket and adds them to the bucket if they aren't there
from google.cloud import storage
import os
import glob

directory_path = "ml/googleVision/sample images"
jpg_files = glob.glob(os.path.join(directory_path, '*.jpg'))

pictures = []

for jpg_file in jpg_files:
    pictures.append(os.path.basename(jpg_file))

print(pictures)

for name in pictures:
    # name = 'file_i_want_to_check.txt'
    storage_client = storage.Client()
    bucket_name = 'devfest-image-bucket-v1'
    bucket = storage_client.bucket(bucket_name)
    stats = storage.Blob(bucket=bucket, name=name).exists(storage_client)
    print(stats)
    if stats == False:
        # upload image to the google cloud bucket
        try:
            os.system(
                "gsutil cp ml/googleVision/sample\ images/{} gs://devfest-image-bucket-v1".format(name))

            print("Success!")
        except:
            print("An error occured while uploading an image :(")
