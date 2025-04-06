from flask import Flask, request, jsonify
import os
import pygame
import utils


alarmobj = False

#Initialize pygame mixer
pygame.mixer.init()
#make the file path 
alarm_sound_path = os.path.join(utils.get_src_path(), "alarm-api","alarm.wav")
pygame.mixer.music.load(alarm_sound_path)

#Create webrouter
app = Flask(__name__)

#Function to play the alarm sound in a loop
def play_alarm_sound():
    if alarmobj:
        pygame.mixer.music.play(loops=-1)
        print('alarm is working')

#POST the enabling of the alarm
@app.route('/alarm/enable', methods=["POST"])
def enable_alarm():
    global alarmobj
    alarmobj=True
    if alarmobj:
        play_alarm_sound()
    return jsonify({
        'enable' : 'Alarm enabled'
    }), 200

#POST the disabling of the alarm
@app.route('/alarm/disable',methods=["POST"])
def disable_alarm():
    global alarmobj
    alarmobj=False
    pygame.mixer.music.stop()
    return jsonify({
        'disable' : 'Alarm disabled'
    }),200

#GET the status of the alarm
@app.route('/status',methods=["GET"])
def get_alarm_status():
    global alarmobj
    return jsonify({
        "status": alarmobj
    }),200

