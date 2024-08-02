import requests
import json
import subprocess
import threading
import time
def readquestion():
    with open("./plugins/yjwj-plugin/sundry/intelligence/question.json", "r", encoding="utf-8") as f:
        question = f.read()
    return question
def diaoyong(question):
    url = "http://127.0.0.1:6867/v1/chat/completions"
    prompt = [{'content': question, 'role': 'user'}]
    row = []
    payload = {
        "model": "moonshot-v1",
        "messages": [{"role": "user", "content": prompt}],
    }
    headers = {
        "Authorization": "Bearer 12345678"
    }
    response = requests.request("POST", url, headers=headers, json=payload)

    for chunk in response.iter_lines(chunk_size=1024):
        row.append(chunk)
    content = ""

    for chunk in row:
        if chunk:
            chunk_str = chunk.decode('utf-8').replace('data: ', '')
            chunk_data = json.loads(chunk_str)
            content_chunk = chunk_data['choices'][0]['delta'].get('content', '')
            content += bytes(content_chunk, "utf-8").decode("unicode_escape")

    print(content)
    with open("./plugins/yjwj-plugin/sundry/intelligence/response.json", "w") as outfile:
        json.dump({"content": content}, outfile)

def fun1():
    subprocess.check_output('python ./plugins/yjwj-plugin/sundry/intelligence/main.py', shell=True)
def fun2():
    subprocess.check_output('python ./plugins/yjwj-plugin/sundry/intelligence/server.py', shell=True)
def zonghe():
    time.sleep(1.5)
    question=readquestion()
    diaoyong(question)    
threds=[]
threds.append(threading.Thread(target=fun1))
threds.append(threading.Thread(target=fun2))
threds.append(threading.Thread(target=zonghe))
if __name__ == '__main__':
    for thred in threds:
        thred.setDaemon(True)
        thred.start()
