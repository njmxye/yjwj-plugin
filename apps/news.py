import requests
from bs4 import BeautifulSoup
import json
import time

res = requests.get('https://www.qqorw.cn/mrzb/585.html')
response = res.text
soup = BeautifulSoup(response, 'html.parser')
with open('res.html', 'w', encoding='utf-8') as f:
    f.write(soup.prettify())