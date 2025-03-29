from gtts import gTTS
import os  

text = "வணக்கம்! எப்படி இருக்கிறீர்கள்?"  
tts = gTTS(text, lang="ta")  
tts.save("output.mp3")  

os.system("start output.mp3")