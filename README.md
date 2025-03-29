https://nigunkarthi.github.io/document-summarization/


Document Summarization Tool

Overview

The Document Summarization Tool is a web-based application that allows users to upload documents in various formats (TXT, PDF, DOC, DOCX) and receive a concise summary. Additionally, the tool provides features such as text translation (English to Tamil) and Tamil text-to-speech conversion.

Features

Upload & Summarize: Supports TXT, PDF, DOC, and DOCX files for summarization.

Translation: Converts English summaries into Tamil using an AI-based model.

Text-to-Speech: Tamil text can be converted to speech output.

Interactive UI: Built with Bootstrap and FontAwesome for a seamless user experience.

Demo Page: A deployed version is available at: Live Demo

Tech Stack

Frontend:

HTML, CSS, Bootstrap

JavaScript (Client-side logic for file handling and UI interactions)

Backend:

Python (For text processing and summarization)

Libraries Used:

fpdf (For text-to-PDF conversion)

sumy (For text summarization using TextRank)

easyocr (For OCR-based text extraction from images in PDFs)

transformers (For English-to-Tamil translation)

gtts (For Tamil text-to-speech conversion)

Installation & Setup

Prerequisites:

Python 3.8+

Node.js (for frontend development if needed)

Required Python Libraries:

pip install fitz python-docx fpdf easyocr opencv-python numpy sumy transformers gtts torch torchvision torchaudio

Running the Project

Clone the Repository:

git clone https://github.com/your-repo/document-summarization.git
cd document-summarization

Start the Frontend:

Open index.html in a browser.

OR use a local server to serve static files.

Run the Backend Model:

python backend.py

Issues & Challenges

The frontend and backend models work independently, but they are not yet connected.

The deployed demo showcases the frontend only.

Future Improvements

Establish API communication between frontend and backend.

Improve UI/UX for better user experience.

Expand language support for translations.

Contributors

Karthik Raj K
Nigun Karthik R
Nandha Kumar P
