import requests
import os
import threading

def send_audio(file_path):
    url = 'http://127.0.0.1:5000/transcribe/en'
    
    absolute_path = os.path.dirname(__file__)
    relative_path = os.path.join(absolute_path, file_path)

    with open(relative_path, 'rb') as file:
        data = {'uuid':'-jx-1', 'alarmType':1, 'timeDuration':10}
        files = {'voice': file}

        req = requests.post(url, files=files, json=data)
        print(req.status_code)
        print(req.text)

threading.Thread(target=send_audio,args=['./voice-english.wav']).start()
threading.Thread(target=send_audio,args=['./voice-dutch.wav']).start()
threading.Thread(target=send_audio,args=['./voice-romanian.wav']).start()