import utils
import pyaudio
import wave
import threading
import os

class MicrophoneHandler:
    def __init__(self, duration, output_path, callback, *callback_args, prefix = "", channels = 1, chunk_size = 1024, rate = 48000):
        self.duration = duration
        self.output_path = output_path
        self.callback = callback
        self.callback_args = callback_args

        self.prefix = prefix
        self.channels = channels
        self.chunk_size = chunk_size
        self.rate = rate

        self.format = pyaudio.paInt16
        self.callbacks = []

        self.pyAudio = pyaudio.PyAudio()
        self.stream = self.pyAudio.open(format=self.format,
                    channels=self.channels,
                    rate=self.rate,
                    input=True,
                    frames_per_buffer=self.chunk_size)

        self.running = True
        self._handle()
        # self.thread = threading.Thread(name='microphone', target=self._handle)
        # self.thread.start()

    def close(self):
        self.running = False
        # self.thread.join()

        # Stop recording
        self.stream.stop_stream()
        self.stream.close()
        self.stream = None

        self.pyAudio.terminate()

        # Join callback threads
        for callbackThread in self.callbacks:
            callbackThread.join()


    def _handle(self):
        while self.running:
            number = utils.use_number()
            
            # Record frames
            frames = []
            for i in range(0, int(self.rate / self.chunk_size * self.duration)):
                if not self.running:
                    return
                data = self.stream.read(self.chunk_size)
                frames.append(data)
            
            if not self.running:
                return

            # Store in file
            filename = self.prefix + str(number) + ".wav"
            file_path = os.path.join(self.output_path, filename)
            wf = wave.open(file_path, 'wb')
            wf.setnchannels(self.channels)
            wf.setsampwidth(self.pyAudio.get_sample_size(self.format))
            wf.setframerate(self.rate)
            wf.writeframes(b''.join(frames))
            wf.close()
            
            if not self.running:
                return 

            # Run callback
            thread = threading.Thread(name='callback', target=self.callback, args=[number, file_path, filename, *self.callback_args])
            thread.start()
            self.callbacks.append(thread)