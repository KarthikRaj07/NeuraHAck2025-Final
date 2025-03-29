from flask import Flask, render_template, request, jsonify
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

app = Flask(__name__, template_folder="template")

# Load the NLP model for translation
model_name = "facebook/nllb-200-distilled-600M"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    text = data.get("text", "")
    target_language = data.get("language", "en")  # Default to English

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Translate the text
    inputs = tokenizer(text, return_tensors="pt")
    output = model.generate(**inputs, forced_bos_token_id=tokenizer.convert_tokens_to_ids(f"{target_language}_Taml"))
    translated_text = tokenizer.batch_decode(output, skip_special_tokens=True)[0]

    return jsonify({"translated_text": translated_text})

if _name_ == '_main_':
    app.run(port=3000, debug=True)