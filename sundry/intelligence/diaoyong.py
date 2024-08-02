import subprocess
import threading

def fun1():
    subprocess.check_output('python ./plugins/yjwj-plugin/sundry/intelligence/main.py', shell=True)
def fun2():
    subprocess.check_output('python ./plugins/yjwj-plugin/sundry/intelligence/server.py', shell=True)
threds=[]
threds.append(threading.Thread(target=fun1))
threds.append(threading.Thread(target=fun2))
if __name__ == '__main__':
    for thred in threds:
        thred.setDaemon(True)
        thred.start()
