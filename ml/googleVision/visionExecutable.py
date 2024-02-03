# First run image checker
# Then run vision py on the new image that is uploaded


# once a new image is uploaded (add code here)
# take the queue and send the names in the queue to the vision py file
from vision import run_quickstart
from image_checker import name_queue
import os
import time


duration = 100
end_time = time.time() + duration

while time.time() < end_time:  # while loop executes for 5 seconds
    try:
        # os.system("python image_checker")
        # os.system("python vision.py")
        name_queue.process_names()

    except FileNotFoundError:
        print("Error in finding files")
    time.sleep(1)

    # Continue with the rest of your code after the loop
    print("Execution completed.")


# def process_uploaded_images():
#     # Create an instance of NameQueueHandler
#     name_queue_handler = NameQueueHandler()

#     # Process names from the queue
#     name_queue_handler.process_names()

#     # Add code here to perform vision processing on each name in the queue
#     # You can call your vision-related functions and pass the names as needed


# if __name__ == "__main__":
#     process_uploaded_images()
