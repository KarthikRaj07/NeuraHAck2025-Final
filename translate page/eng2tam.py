from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

model_name = "facebook/nllb-200-distilled-600M"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

text = "Hello, how are you?"


inputs = tokenizer(text, return_tensors="pt")


output = model.generate(**inputs, forced_bos_token_id=tokenizer.convert_tokens_to_ids("tam_Taml"))

translated_text = tokenizer.batch_decode(output, skip_special_tokens=True)[0]
print(translated_text) 
