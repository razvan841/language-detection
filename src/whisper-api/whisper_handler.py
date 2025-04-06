import threading
import time
import whisper

class WhisperHandler:
    def __init__(self, model = "base"): 
        self.model =  whisper.load_model(model)
        self.queue = []
        self.result = {}

        # Start handle thread
        self.running = True
        self._processing = False
        self.thread = threading.Thread(name="whipser", target=self._handle)
        self.thread.start()
    
    def queue_length(self):
        return len(self.queue)
    
    def processing(self):
        return self._processing

    def close(self):
        self.running = False
        self.thread.join()

    def transcribe(self, file_path):
        self.queue.append(file_path)

        # Wait until handled
        while self.running and not file_path in self.result:
            time.sleep(50 / 1000)

        if not file_path in self.result:
            return None
        
        return self.result[file_path]

    def _handle(self):
        while self.running:
            # Queue empty wait 50ms
            if (len(self.queue) < 1):
                time.sleep(50 / 1000)
                continue

            self._processing = True

            # Transcribe all queued files
            file_path = self.queue.pop(0)
            self.result[file_path] = self.model.transcribe(file_path, fp16=False)

            self._processing = False