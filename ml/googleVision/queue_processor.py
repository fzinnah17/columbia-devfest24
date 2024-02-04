import queue
from vision import run_quickstart


class NameQueue:
    def __init__(self):
        # Create a queue instance
        self.queue = queue.Queue()

    def add_name(self, name):
        # Add the name to the queue
        self.queue.put(name)

    def process_names(self):
        # Process names from the queue
        while not self.queue.empty():
            name = self.queue.get()
            # Do something with the name (e.g., print it)

            # Runs vision
            labels = run_quickstart(name)
            # Extract top three descriptions
            descriptions = [label.description for label in labels[:3]]

            combined_descriptions = ', '.join(descriptions)

            return combined_descriptions  # sync this with the image THIS MIGHT CAUSE PROBLEMS


# Example of processing names from the queue
if __name__ == "__main__":
    name_queue = NameQueue()
    name_queue.process_names()
