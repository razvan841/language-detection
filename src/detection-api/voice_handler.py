import webrtcvad
import collections
import contextlib
import wave
import os

class VoiceHandler:
    def __init__(self, output_path, aggressiveness = 2, prefix = "", duration = 30, padding_duration = 300):
        self.output_path = output_path

        self.aggressiveness = aggressiveness
        self.prefix = prefix
        
        self.duration = duration
        self.padding_duration = padding_duration
        self.vad = webrtcvad.Vad(self.aggressiveness)

    def handle(self, number, file_path):
        audio, sample_rate = self.read_wave(file_path)

        frames = Frame.generator(self.duration, audio, sample_rate)
        frames = list(frames)

        segment_paths = []
        segments = self.collector(sample_rate, frames)
        for i, segment in enumerate(segments):
            segment_path = os.path.join(self.output_path, self.prefix + str(number) + '-%002d.wav' % (i,))
            self.write_wave(segment_path, segment, sample_rate)
            segment_paths.append(segment_path)

        return segment_paths

    def collector(self, sample_rate, frames):
        num_padding_frames = int(self.padding_duration / self.duration)
        ring_buffer = collections.deque(maxlen=num_padding_frames)
        triggered = False

        voiced_frames = []
        for frame in frames:
            is_speech = self.vad.is_speech(frame.bytes, sample_rate)

            if not triggered:
                ring_buffer.append((frame, is_speech))
                num_voiced = len([f for f, speech in ring_buffer if speech])
                
                if num_voiced > 0.9 * ring_buffer.maxlen:
                    triggered = True
                    
                    for f, s in ring_buffer:
                        voiced_frames.append(f)
                    ring_buffer.clear()
            else:
                voiced_frames.append(frame)
                ring_buffer.append((frame, is_speech))
                num_unvoiced = len([f for f, speech in ring_buffer if not speech])
                
                if num_unvoiced > 0.9 * ring_buffer.maxlen:
                    triggered = False
                    yield b''.join([f.bytes for f in voiced_frames])
                    ring_buffer.clear()
                    voiced_frames = []
        
        if voiced_frames:
            yield b''.join([f.bytes for f in voiced_frames])

    def read_wave(self, file_path):
        with contextlib.closing(wave.open(file_path, 'rb')) as wf:
            num_channels = wf.getnchannels()
            assert num_channels == 1
            sample_width = wf.getsampwidth()
            assert sample_width == 2
            sample_rate = wf.getframerate()
            assert sample_rate in (8000, 16000, 32000, 48000)
            pcm_data = wf.readframes(wf.getnframes())
            return pcm_data, sample_rate
        
    def write_wave(self, file_path, audio, sample_rate):
        with contextlib.closing(wave.open(file_path, 'wb')) as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(sample_rate)
            wf.writeframes(audio)


class Frame(object):
    def __init__(self, bytes, duration, timestamp):
        self.bytes = bytes
        self.duration = duration
        self.timestamp = timestamp

    @staticmethod
    def generator(duration_ms, audio, sample_rate):
        index = int(sample_rate * (duration_ms / 1000.0) * 2)
        offset = 0
        timestamp = 0.0
        duration = (float(index) / sample_rate) / 2.0
        while offset + index < len(audio):
            yield Frame(audio[offset:offset + index], duration, timestamp)
            timestamp += duration
            offset += index