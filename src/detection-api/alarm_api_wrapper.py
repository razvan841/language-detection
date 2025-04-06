import requests

class AlarmApiWrapper:
    def __init__(self,url):
        self.url = url

    def enable_alarm(self):
        url=self.url + "/alarm/enable"

        try:
            req = requests.post(url)
            if(req.status_code==200):
                return {"success": True}
            else:
                return {"success": False}
        except:
            return {"success": False}
    
    def disable_alarm(self):
        url = self.url + "/alarm/disable"

        try:
            req = requests.post(url)
            if req.status_code == 200:
                return {"success": True}
            else:
                return {"success": False}
        except: 
            return {"success": False}
            
    def get_alarm_status(self):
        url = self.url + "/alarm"

        try:
            req = requests.get(url)
            if req.status_code == 200:
                data = req.json()
                return {"success": True, "status": data.get("status")}
            else:
                return {"success": False}
        except:
            return {"success": False}