from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch


def giveRating(text):

    # Set device (CPU or GPU)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Replace 'path_to_your_fine_tuned_model' with the actual path to your fine-tuned model

    # CHANGE THIS WHEN NEEDED
    fine_tuned_model_path = "ml/path_to_save_model (too big)"
    # remove (too big) when needed

    # select mode path here
    pretrained_LM_path = "kornosk/polibertweet-mlm"
    # Load tokenizer and fine-tuned model
    tokenizer = AutoTokenizer.from_pretrained(pretrained_LM_path)

    model = AutoModelForSequenceClassification.from_pretrained(
        fine_tuned_model_path)
    model.to(device)

    # Example text input for prediction
    new_text = "Henry Kissinger"

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
    # print(f"Predicted Political Alignment Class: {predicted_class}")
    return predicted_class
