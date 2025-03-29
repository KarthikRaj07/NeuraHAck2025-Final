// Language content (same as before)
const englishContent = {
    mainTitle: "Document Summarizer",
    subTitle: "Upload your document and get a concise summary instantly",
    uploadText: "Choose a document or drag it here",
    buttonText: "Summarize Document",
    summaryTitle: "Summary",
    copyText: "Copy Summary",
    fileFormatText: "Supports: .txt, .pdf, .doc, .docx",
    noFileText: "No file selected",
    translateText: "Translate",
    speakText: "Speak",
    muteText: "Mute",
    processingText: "Processing...",
    summarizeText: "Summarize Document",
    fileReadError: "Failed to read file!",
    uploadFirst: "Please upload a document first!",
    ttsNotSupported: "Text-to-Speech not supported in this browser",
    translatedTo: "Translated to Tamil:",
    mockTranslation: "This is a mock translation. In a real app, this would be translated from an API."
};

const tamilContent = {
    mainTitle: "ஆவணம் சுருக்கம்",
    subTitle: "உங்கள் ஆவணத்தை பதிவேற்றம் செய்து உடனடியாக ஒரு சுருக்கத்தைப் பெறவும்",
    uploadText: "ஒரு ஆவணத்தை தேர்ந்தெடுக்கவும் அல்லது இங்கே இழுக்கவும்",
    buttonText: "ஆவணத்தை சுருக்கவும்",
    summaryTitle: "சுருக்கம்",
    copyText: "சுருக்கத்தை நகலெடு",
    fileFormatText: "ஆதரவு: .txt, .pdf, .doc, .docx",
    noFileText: "கோப்பு தேர்ந்தெடுக்கப்படவில்லை",
    translateText: "மொழிபெயர்",
    speakText: "பேசு",
    muteText: "அமைதி",
    processingText: "செயலாக்கம்...",
    summarizeText: "ஆவணத்தை சுருக்கவும்",
    fileReadError: "கோப்பை வாசிக்க தவறிவிட்டது!",
    uploadFirst: "முதலில் ஒரு ஆவணத்தை பதிவேற்றம் செய்யவும்!",
    ttsNotSupported: "உரை-முதல்-பேச்சு இந்த உலாவியில் ஆதரிக்கப்படவில்லை",
    translatedTo: "ஆங்கிலத்தில் மொழிபெயர்க்கப்பட்டது:",
    mockTranslation: "இது ஒரு போலி மொழிபெயர்ப்பு. ஒரு உண்மையான பயன்பாட்டில், இது ஒரு API இலிருந்து மொழிபெயர்க்கப்படும்."
};

// DOM Elements (same as before)
const englishBtn = document.getElementById('englishBtn');
const tamilBtn = document.getElementById('tamilBtn');
const playSpeechBtn = document.getElementById('playSpeechBtn');
const fileInput = document.getElementById('fileInput');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const fileInfoDisplay = document.getElementById('fileInfoDisplay');
const summarizeBtn = document.getElementById('summarizeBtn');
const outputDiv = document.getElementById('output');
const summaryContent = document.getElementById('summaryContent');
const translatedContent = document.getElementById('translatedContent');
const translateSummaryBtn = document.getElementById('translateSummaryBtn');
const speakSummaryBtn = document.getElementById('speakSummaryBtn');
const copyBtn = document.getElementById('copyBtn');
const uploadLabel = document.querySelector('.file-upload-label');

// Speech control variables (same as before)
let isSpeaking = false;
let currentSpeech = null;

// Initialize PDF.js worker (same as before)
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

// File type icons mapping (same as before)
function getFileIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    switch(extension) {
        case 'pdf': return 'fa-file-pdf';
        case 'doc':
        case 'docx': return 'fa-file-word';
        case 'txt': return 'fa-file-alt';
        default: return 'fa-file';
    }
}

// Set content based on language (same as before)
function setContent(content) {
    document.getElementById('mainTitle').textContent = content.mainTitle;
    document.getElementById('subTitle').textContent = content.subTitle;
    document.getElementById('uploadText').textContent = content.uploadText;
    document.getElementById('buttonText').textContent = content.buttonText;
    document.getElementById('summaryTitle').textContent = content.summaryTitle;
    document.getElementById('copyText').textContent = content.copyText;
    document.getElementById('fileFormatText').textContent = content.fileFormatText;
    document.getElementById('translateText').textContent = content.translateText;
    document.getElementById('speakText').textContent = isSpeaking ? content.muteText : content.speakText;
    
    if (fileInput.files.length === 0) {
        fileNameDisplay.textContent = content.noFileText;
    }
}

// Toggle speech functions (same as before)
function toggleHeaderSpeech() {
    const synth = window.speechSynthesis;
    
    if (!synth) {
        alert(tamilBtn.classList.contains('active') ? 
            tamilContent.ttsNotSupported : 
            englishContent.ttsNotSupported);
        return;
    }
    
    if (isSpeaking) {
        synth.cancel();
        isSpeaking = false;
        playSpeechBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        playSpeechBtn.classList.remove('muted');
    } else {
        const lang = tamilBtn.classList.contains('active') ? 'ta-IN' : 'en-US';
        const text = tamilBtn.classList.contains('active') ? 
            ${tamilContent.mainTitle}. ${tamilContent.subTitle} : 
            ${englishContent.mainTitle}. ${englishContent.subTitle};
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        
        utterance.onend = function() {
            isSpeaking = false;
            playSpeechBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            playSpeechBtn.classList.remove('muted');
        };
        
        synth.speak(utterance);
        isSpeaking = true;
        playSpeechBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        playSpeechBtn.classList.add('muted');
    }
}

function toggleSummarySpeech() {
    const synth = window.speechSynthesis;
    
    if (!synth) {
        alert(tamilBtn.classList.contains('active') ? 
            tamilContent.ttsNotSupported : 
            englishContent.ttsNotSupported);
        return;
    }
    
    if (isSpeaking) {
        synth.cancel();
        isSpeaking = false;
        speakSummaryBtn.innerHTML = '<i class="fas fa-volume-up me-1"></i>' + 
            (tamilBtn.classList.contains('active') ? tamilContent.speakText : englishContent.speakText);
        speakSummaryBtn.classList.remove('muted');
    } else {
        const lang = tamilBtn.classList.contains('active') ? 'ta-IN' : 'en-US';
        const text = summaryContent.textContent;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        
        utterance.onend = function() {
            isSpeaking = false;
            speakSummaryBtn.innerHTML = '<i class="fas fa-volume-up me-1"></i>' + 
                (tamilBtn.classList.contains('active') ? tamilContent.speakText : englishContent.speakText);
            speakSummaryBtn.classList.remove('muted');
        };
        
        synth.speak(utterance);
        isSpeaking = true;
        speakSummaryBtn.innerHTML = '<i class="fas fa-volume-mute me-1"></i>' + 
            (tamilBtn.classList.contains('active') ? tamilContent.muteText : englishContent.muteText);
        speakSummaryBtn.classList.add('muted');
    }
}

// File input change handler (same as before)
fileInput.addEventListener('change', function(e) {
    const fileInfoDisplay = document.getElementById('fileInfoDisplay');
    if (e.target.files.length) {
        const file = e.target.files[0];
        fileNameDisplay.textContent = file.name;
        fileInfoDisplay.style.display = 'inline-flex';
        
        const existingIcon = fileInfoDisplay.querySelector('.file-info-icon:not(.fa-file-alt)');
        if (existingIcon) {
            existingIcon.remove();
        }
        
        const fileIcon = document.createElement('i');
        fileIcon.className = 'fas file-info-icon ' + getFileIcon(file.name);
        fileInfoDisplay.insertBefore(fileIcon, fileNameDisplay);
    } else {
        fileInfoDisplay.style.display = 'none';
    }
});

// Drag and drop functionality (same as before)
uploadLabel.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadLabel.style.background = '#e9ecef';
    uploadLabel.style.borderColor = 'var(--primary-blue)';
});

uploadLabel.addEventListener('dragleave', () => {
    uploadLabel.style.background = '#f8f9fa';
    uploadLabel.style.borderColor = '#c3cfe2';
});

uploadLabel.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadLabel.style.background = '#f8f9fa';
    uploadLabel.style.borderColor = '#c3cfe2';
    
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        const event = new Event('change');
        fileInput.dispatchEvent(event);
    }
});

// Language switching (same as before)
englishBtn.addEventListener('click', () => {
    setContent(englishContent);
    englishBtn.classList.add('active');
    tamilBtn.classList.remove('active');
    translatedContent.style.display = 'none';
});

tamilBtn.addEventListener('click', () => {
    setContent(tamilContent);
    tamilBtn.classList.add('active');
    englishBtn.classList.remove('active');
    translatedContent.style.display = 'none';
});

// Copy summary to clipboard (same as before)
copyBtn.addEventListener('click', function() {
    const contentToCopy = summaryContent.textContent + 
        (translatedContent.style.display === 'block' ? 
        '\n\n' + translatedContent.textContent : '');
    navigator.clipboard.writeText(contentToCopy).then(() => {
        const currentContent = tamilBtn.classList.contains('active') ? 
            tamilContent : englishContent;
        copyBtn.innerHTML = '<i class="fas fa-check me-1"></i>' + 
            (tamilBtn.classList.contains('active') ? 'நகலெடுக்கப்பட்டது!' : 'Copied!');
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy me-1"></i>' + currentContent.copyText;
        }, 2000);
    });
});

// Translate summary (same as before)
translateSummaryBtn.addEventListener('click', function() {
    if (translatedContent.style.display === 'block') {
        translatedContent.style.display = 'none';
        return;
    }
    
    const currentContent = tamilBtn.classList.contains('active') ? 
        tamilContent : englishContent;
    
    translatedContent.innerHTML = <p><strong>${currentContent.translatedTo}</strong><br>${currentContent.mockTranslation}</p>;
    translatedContent.style.display = 'block';
});

// Improved text extraction functions (same as before)
async function extractTextFromPDF(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        
        fileReader.onload = async function() {
            try {
                const typedArray = new Uint8Array(this.result);
                const pdf = await pdfjsLib.getDocument(typedArray).promise;
                let text = '';
                
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const strings = content.items.map(item => item.str);
                    text += strings.join(' ') + '\n';
                }
                
                resolve(text);
            } catch (error) {
                reject(error);
            }
        };
        
        fileReader.onerror = reject;
        fileReader.readAsArrayBuffer(file);
    });
}

async function extractTextFromWord(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        
        fileReader.onload = async function() {
            try {
                const arrayBuffer = this.result;
                const result = await mammoth.extractRawText({ arrayBuffer });
                resolve(result.value);
            } catch (error) {
                reject(error);
            }
        };
        
        fileReader.onerror = reject;
        fileReader.readAsArrayBuffer(file);
    });
}

function extractTextFromTxt(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        
        fileReader.onload = function() {
            resolve(this.result);
        };
        
        fileReader.onerror = reject;
        fileReader.readAsText(file);
    });
}

// NEW IMPROVED SUMMARIZATION FUNCTION
function generateSummary(text, summaryLength = 3) {
    // Clean the text
    text = text.replace(/\s+/g, ' ').trim();
    
    // More sophisticated sentence splitting
    const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
    
    // Score sentences by importance (simple version - in real app use more sophisticated algorithm)
    const scoredSentences = sentences.map(sentence => {
        // Score based on length (medium length sentences tend to be more important)
        const wordCount = sentence.split(' ').length;
        let score = Math.min(1, wordCount / 20); // Normalize score
        
        // Boost score if sentence contains important words
        const importantWords = ['important', 'key', 'summary', 'conclusion', 'result', 'findings'];
        importantWords.forEach(word => {
            if (sentence.toLowerCase().includes(word)) {
                score += 0.5;
            }
        });
        
        return { sentence, score };
    });
    
    // Sort sentences by score
    scoredSentences.sort((a, b) => b.score - a.score);
    
    // Take top sentences
    const topSentences = scoredSentences.slice(0, summaryLength);
    
    // Sort them back to original order for coherence
    topSentences.sort((a, b) => 
        sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence)
    );
    
    // Join the sentences
    return topSentences.map(s => s.sentence).join(' ');
}

// Improved summarize document function
summarizeBtn.addEventListener('click', async function() {
    if (!fileInput.files.length) {
        alert(tamilBtn.classList.contains('active') ? 
            tamilContent.uploadFirst : 
            englishContent.uploadFirst);
        return;
    }
    
    // Show loading state
    const buttonText = document.getElementById('buttonText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const currentContent = tamilBtn.classList.contains('active') ? 
        tamilContent : englishContent;
    
    buttonText.textContent = currentContent.processingText;
    loadingSpinner.style.display = "inline-block";
    summarizeBtn.disabled = true;
    
    const file = fileInput.files[0];
    const extension = file.name.split('.').pop().toLowerCase();
    
    try {
        let text = '';
        
        if (extension === 'pdf') {
            text = await extractTextFromPDF(file);
        } else if (extension === 'doc' || extension === 'docx') {
            text = await extractTextFromWord(file);
        } else if (extension === 'txt') {
            text = await extractTextFromTxt(file);
        } else {
            throw new Error('Unsupported file format');
        }
        
        // Generate better summary
        const summary = generateSummary(text, 5); // Get 5 most important sentences
        
        // Display summary
        summaryContent.innerHTML = <p>${summary}</p>;
        outputDiv.style.display = "block";
        translatedContent.style.display = 'none';
        
        // Reset button state
        buttonText.textContent = currentContent.summarizeText;
        loadingSpinner.style.display = "none";
        summarizeBtn.disabled = false;
        
        // Scroll to summary
        outputDiv.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error processing file:', error);
        alert(tamilBtn.classList.contains('active') ? 
            tamilContent.fileReadError : 
            englishContent.fileReadError);
        buttonText.textContent = currentContent.summarizeText;
        loadingSpinner.style.display = "none";
        summarizeBtn.disabled = false;
    }
});

// Event listeners for speech buttons (same as before)
playSpeechBtn.addEventListener('click', toggleHeaderSpeech);
speakSummaryBtn.addEventListener('click', toggleSummarySpeech);

// Initialize with English content (same as before)
setContent(englishContent);