import os
import fitz
from docx import Document
from fpdf import FPDF
import easyocr
import cv2
import numpy as np
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.text_rank import TextRankSummarizer

reader = easyocr.Reader(['en'])

def convert_txt_to_pdf(txt_path, pdf_path):
    """Converts a .txt file to a .pdf file."""
    with open(txt_path, "r", encoding="utf-8") as file:
        content = file.read()

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    
    for line in content.split("\n"):
        pdf.multi_cell(190, 10, line.encode('latin-1', 'replace').decode('latin-1'))

    pdf.output(pdf_path, "F")
    return pdf_path

def convert_doc_to_pdf(doc_path, pdf_path):
    """Converts a .docx file to a .pdf file while handling special characters."""
    doc = Document(doc_path)
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    for para in doc.paragraphs:
        pdf.multi_cell(190, 10, para.text.encode('latin-1', 'replace').decode('latin-1'))

    pdf.output(pdf_path, "F")
    return pdf_path

def extract_text_from_pdf(pdf_path):
    """Extracts text from a PDF file."""
    doc = fitz.open(pdf_path)
    full_text = "\n".join([page.get_text("text") for page in doc])
    return full_text.strip()

def extract_images_from_pdf(pdf_path):
    """Extracts images from a PDF and applies OCR."""
    doc = fitz.open(pdf_path)
    extracted_text = ""

    for page in doc:
        for img_index, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            base_image = doc.extract_image(xref)
            img_bytes = base_image["image"]
            img_np = np.frombuffer(img_bytes, dtype=np.uint8)
            img_cv = cv2.imdecode(img_np, cv2.IMREAD_COLOR)

            text_results = reader.readtext(img_cv)
            extracted_text += "\n".join([t[1] for t in text_results]) + "\n"

    return extracted_text.strip()

def summarize_text(text, sentences_count=5):
    """Summarizes extracted text using TextRank."""
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = TextRankSummarizer()
    summary = summarizer(parser.document, sentences_count)

    return " ".join(str(sentence) for sentence in summary)

def extract_key_insights(text):
    """Extracts key insights from summarized text."""
    lines = text.split(". ")
    key_points = [f"- {line.strip()}." for line in lines if len(line) > 10]
    return "\n".join(key_points)

def process_document(file_path):
    """Processes a file: detects type, converts to PDF if needed, extracts text, and summarizes."""
    if not os.path.exists(file_path):
        print(f"[❌] File not found: {file_path}")
        return None

    print(f"[✅] File found: {file_path}")

    file_ext = file_path.split(".")[-1].lower()
    pdf_path = file_path.replace(f".{file_ext}", ".pdf")

    if file_ext in ["doc", "docx"]:
        print("[INFO] Converting DOC/DOCX to PDF...")
        pdf_path = convert_doc_to_pdf(file_path, pdf_path)
    elif file_ext == "txt":
        print("[INFO] Converting TXT to PDF...")
        pdf_path = convert_txt_to_pdf(file_path, pdf_path)
    elif file_ext == "pdf":
        print("[INFO] PDF detected, no conversion needed.")
    else:
        print("[ERROR] Unsupported file format!")
        return None

    text = extract_text_from_pdf(pdf_path)
    image_text = extract_images_from_pdf(pdf_path)
    
    if image_text:
        text += "\n" + image_text

    if text.strip():
        summary = summarize_text(text)
        key_insights = extract_key_insights(summary)
        
        print("\n🔹 **Summary:**\n", summary)
        print("\n🔑 **Key Insights:**\n", key_insights)
        return key_insights
    else:
        print("[ERROR] No text found in the document.")


file_path = "document.docx"  
process_document(file_path)
