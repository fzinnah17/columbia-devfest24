from transformers import AutoModelForSequenceClassification, AutoTokenizer, AdamW
import torch
from torch.utils.data import DataLoader, TensorDataset
from sklearn.model_selection import train_test_split
import csv

# Set device (CPU or GPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Define paths
pretrained_LM_path = "kornosk/polibertweet-mlm"
save_path = "path_to_save_model"

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(pretrained_LM_path)
# Adjust num_labels based on your political alignment categories
model = AutoModelForSequenceClassification.from_pretrained(
    pretrained_LM_path, num_labels=5)  # Change num_labels to 5
model.to(device)


#
#
#
#
#
#
#
#
#


def flatten_list(lst):
    flat_list = []
    for item in lst:
        if isinstance(item, list):
            flat_list.extend(flatten_list(item))
        else:
            flat_list.append(item)
    return flat_list


with open('ml/datasets/datafile.csv', 'r') as file:
    reader = csv.reader(file)
    texts = list(reader)


with open('ml/datasets/labels.csv', 'r') as file:
    reader = csv.reader(file)
    labels = list(reader)

# Example
labels = flatten_list(labels)
texts = flatten_list(texts)


#
#
#
#
#


# Convert labels to numerical format
label_dict = {"very liberal": 0, "liberal": 1,
              "neutral": 2, "conservative": 3, "very conservative": 4}

print(len(label_dict))
labels = [label_dict[label] for label in labels]

print(len(labels))
print(len(texts))

# Split the dataset into training and validation sets
texts_train, texts_val, labels_train, labels_val = train_test_split(
    texts, labels, test_size=0.2, random_state=42)

# Tokenize and format the datasets
tokenized_train = tokenizer(
    texts_train, padding=True, truncation=True, return_tensors="pt")
labels_train = torch.tensor(labels_train).to(device)
dataset_train = TensorDataset(
    tokenized_train["input_ids"], tokenized_train["attention_mask"], labels_train)

tokenized_val = tokenizer(texts_val, padding=True,
                          truncation=True, return_tensors="pt")
labels_val = torch.tensor(labels_val).to(device)
dataset_val = TensorDataset(
    tokenized_val["input_ids"], tokenized_val["attention_mask"], labels_val)

# Define DataLoader
batch_size = 200
dataloader_train = DataLoader(
    dataset_train, batch_size=batch_size, shuffle=True)
dataloader_val = DataLoader(dataset_val, batch_size=batch_size, shuffle=False)

# Define optimizer and loss function
optimizer = AdamW(model.parameters(), lr=5e-5)
criterion = torch.nn.CrossEntropyLoss()

# Training loop
num_epochs = 20  # Adjust based on your dataset size and training preferences
for epoch in range(num_epochs):
    model.train()
    total_loss = 0
    for batch in dataloader_train:
        input_ids, attention_mask, labels = batch
        input_ids, attention_mask, labels = input_ids.to(
            device), attention_mask.to(device), labels.to(device)

        outputs = model(input_ids=input_ids,
                        attention_mask=attention_mask, labels=labels)
        loss = outputs.loss

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    avg_loss = total_loss / len(dataloader_train)
    print(f"Epoch {epoch + 1}/{num_epochs}, Training Loss: {avg_loss}")

    # Validation loop
    model.eval()
    total_val_loss = 0
    correct_predictions = 0

    with torch.no_grad():
        for batch in dataloader_val:
            input_ids, attention_mask, labels = batch
            input_ids, attention_mask, labels = input_ids.to(
                device), attention_mask.to(device), labels.to(device)

            outputs = model(input_ids=input_ids,
                            attention_mask=attention_mask, labels=labels)
            loss = outputs.loss
            logits = outputs.logits

            total_val_loss += loss.item()
            correct_predictions += (torch.argmax(logits,
                                    dim=1) == labels).sum().item()

    avg_val_loss = total_val_loss / len(dataloader_val)
    accuracy = correct_predictions / len(texts_val)
    print(f"Validation Loss: {avg_val_loss}, Accuracy: {accuracy}")

# Save the fine-tuned model
model.save_pretrained(save_path)

#
#
#
#
#
#

print("Example Predictions:")
with torch.no_grad():
    model.eval()
    for i in range(min(5, len(texts_val))):
        input_ids, attention_mask, labels = dataset_val[i]
        input_ids, attention_mask, labels = input_ids.unsqueeze(0).to(
            device), attention_mask.unsqueeze(0).to(device), labels.unsqueeze(0).to(device)

        outputs = model(input_ids=input_ids,
                        attention_mask=attention_mask, labels=labels)
        logits = outputs.logits

        predicted_class = torch.argmax(logits, dim=1).item()
        true_class = labels.item()

        print(
            f"Example {i + 1}: Predicted={predicted_class}, True={true_class}")

#
#
#
#
#
#
#
#
#
# Set device (CPU or GPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load tokenizer and fine-tuned model
# pretrained_LM_path = save_path
tokenizer = AutoTokenizer.from_pretrained(pretrained_LM_path)
model = AutoModelForSequenceClassification.from_pretrained(save_path)
model.to(device)

# Example text input for prediction
new_text = "So I am over here subscribe"

# Tokenize and format the input
tokenized_input = tokenizer(new_text, padding=True,
                            truncation=True, return_tensors="pt").to(device)

# Make prediction
with torch.no_grad():
    model.eval()
    outputs = model(**tokenized_input)
    logits = outputs.logits

# Get predicted class
predicted_class = torch.argmax(logits, dim=1).item()
print(f"Predicted Political Alignment Class: {predicted_class}")
