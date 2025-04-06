WHISPER_URL="http://192.168.163.79:5000"
DURATION = 15
ALARM_URL="http://127.0.0.1:5001"

if __name__ == "__main__":
    from sys import path as sys_path
    from os import path
    src_path = path.join(path.dirname(__file__), "..")
    sys_path.append(src_path)

    print("running on detection")
    
# Detection
import os
import sys
import signal
import utils

from microphone_handler import MicrophoneHandler
from voice_handler import VoiceHandler
from whisper_api_wrapper import WhisperApiWrapper
from alarm_api_wrapper import AlarmApiWrapper

# Temp directory
TEMP_DIRECTORY = os.path.join(utils.get_src_path(), "temp")
utils.require_folder(TEMP_DIRECTORY)

# Setup whisper api
whisperApiWrapper = WhisperApiWrapper(WHISPER_URL)

#Setup alarm api
alarmApiWrapper = AlarmApiWrapper(ALARM_URL)

# Setup voice detection
voiceHandler = VoiceHandler(TEMP_DIRECTORY, aggressiveness=3, prefix="voice-")

# Setup microphone
def handle_microphone_callback(number, file_path, filename, duration):
    segment_paths = voiceHandler.handle(number, file_path)

    for segment_path in segment_paths:
        transcribed = whisperApiWrapper.transcribe(segment_path, "en")

        if transcribed["success"] != True:
            continue
        
        spoken = transcribed["data"]["spoken"]
        detected = transcribed["data"]["detected"]
        text = transcribed["data"]["text"]

        if not spoken:
            print("alarm!!!!")
            alarmApiWrapper.enable_alarm()

        os.remove(segment_path)

    os.remove(file_path)
    utils.free_number(number)

microphoneHandler = MicrophoneHandler(DURATION, TEMP_DIRECTORY, handle_microphone_callback, DURATION, prefix="recording-")

# Exit handler
def exit_gracefully(signal, frame):
    print("Closing microphone handler")
    microphoneHandler.close()
    sys.exit(0)

signal.signal(signal.SIGINT, exit_gracefully)