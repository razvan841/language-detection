from flask import Flask, request, jsonify
import signal
import sys
import os
import utils

from whisper_handler import WhisperHandler

# Temp directory
TEMP_DIRECTORY = os.path.join(utils.get_src_path(), "temp")
utils.require_folder(TEMP_DIRECTORY)

# Setup whisper
whisperHandler = WhisperHandler()

# Create webrouter
app = Flask(__name__)

@app.route('/health', methods=["GET"])
def health():
    global whisperHandler

    return jsonify({
        "queue": whisperHandler.queue_length(),
        "processing": whisperHandler.processing()
    }), 200

@app.route('/transcribe/<language>', methods=["POST"])
def recognition(language):
    global TEMP_DIRECTORY, whisperHandler

    if request.method != "POST":
        return "Method Not Allowed", 405

    file = request.files['voice']

    # Safe file to temp folder
    number = utils.use_number()
    path = os.path.join(TEMP_DIRECTORY, "whisper-" + str(number) + os.path.splitext(file.filename)[1])
    file.save(path)

    # Transcribe
    whisperResult = whisperHandler.transcribe(path)

    if whisperResult is None:
        return jsonify(None), 404

    result = {
        "spoken": whisperResult["language"] == language,
        "detected": whisperResult["language"],
        "text": whisperResult["text"]
    }

    # Cleanup
    os.remove(path)
    utils.free_number(number)

    return jsonify(result), 200

# Exit handler
def exit_gracefully(signal, frame):
    print("Closing whisper handler")
    whisperHandler.close()
    sys.exit(0)

signal.signal(signal.SIGINT, exit_gracefully)