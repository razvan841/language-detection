import requests

class WhisperApiWrapper:
    def __init__(self, url):
        self.url = url

    def transcribe(self, file_path, language):
        url = self.url + "/transcribe/" + language

        try:
            with open(file_path, 'rb') as file:
                data = {'uuid':'-jx-1', 'alarmType':1, 'timeDuration':10}
                files = {'voice': file}

                req = requests.post(url, files=files, json=data)
                print(req.status_code)
                print(req.text)
                if (req.status_code != 200):
                    return {
                        "success": False
                    }
                
                data = req.json()
                return {
                        "success": True,
                        "data": data
                    }
        except:
            return {
                "success": False
            }
