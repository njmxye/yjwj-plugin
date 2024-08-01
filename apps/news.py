import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime
def calculate_a_value(target_date):
    # 基准日期和基准值
    base_date = datetime(2024, 7, 31)
    base_value = 585

    # 将目标日期字符串转换为datetime对象
    target_date = datetime.strptime(target_date, '%Y-%m-%d')

    # 计算两个日期之间的天数差
    days_difference = (target_date - base_date).days

    # 计算目标日期的a值
    a_value = base_value + days_difference

    return a_value

current_date = time.strftime("%Y-%m-%d")
a_value = calculate_a_value(current_date)
res = requests.get(f'https://www.qqorw.cn/mrzb/{a_value}.html')
response = res.text
soup = BeautifulSoup(response, 'html.parser')
''' with open('res.html', 'w', encoding='utf-8') as f:
    f.write(soup.prettify())
    f.close()
    print('res.html已生成') '''
news_items = soup.find_all('p')
news_list = []

for item in news_items:
    news_list.append(item.text.strip())

''' for index, news in enumerate(news_list, start=1):
    print(f"{index}、{news}") '''

with open('news.json', 'w', encoding='utf-8') as f:
    json.dump(news_list, f, ensure_ascii=False, indent=4)
    f.close()
    print('news.json已生成')