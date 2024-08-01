import requests  
from bs4 import BeautifulSoup  
import os  
import json
from requests_html import HTMLSession
import time
import lxml_html_clean
import random
final_list = []
headerstongyong = {
  "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
  "accept-language": "zh-CN,zh;q=0.9",
  "cache-control": "no-cache",
  "pragma": "no-cache",
  "priority": "i",
  "referer": "https://www.yjwujian.cn/media/",
  "sec-ch-ua-mobile": "?0",
  "sec-fetch-dest": "image",
  "sec-fetch-mode": "no-cors",
  "sec-fetch-site": "cross-site",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
  "x-requested-with": "XMLHttpRequest"
}
def download_images(url, folder_name, headers, cookies):
    try:
        session = HTMLSession()
        res = session.get(
            url=url,
            headers=headers,
            cookies=cookies
        )
        res.html.render()
        soup = BeautifulSoup(res.html.html, 'html.parser')
        img_tags = soup.find_all('img')

        if not os.path.exists(folder_name):
            os.makedirs(folder_name)

        i = 0
        for img_tag in img_tags:
            i += 1
            img_url = img_tag.get('src')
            final_list.append(img_url)

        print(f"成功获取 {i} 张图片的URL列表。")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        print("获取的图片链接列表成功")

def download_images2(url, folder_name, headers, cookies):
    try:
        session = HTMLSession()
        res = session.get(
            url=url,
            headers=headers,
            cookies=cookies
        )
        res.html.render()
        soup = BeautifulSoup(res.html.html, 'html.parser')
        img_tags = soup.find_all('div', class_='item')

        if not os.path.exists(folder_name):
            os.makedirs(folder_name)

        i = 0
        for img_tag in img_tags:
            i += 1
            img_url = img_tag.get('data-thumb')
            final_list.append(img_url)

        print(f"成功获取 {i} 张图片的URL列表。")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        print("获取的图片链接列表成功")

def main():
    # 下载海报
    haibao_url = "https://www.yjwujian.cn/media/#/pic"
    haibao_folder_name = "yjwujian_images/haibao"
    haibao_headers = {
        "Referer": "https://www.yjwujian.cn/media/",
        "sec-ch-ua-mobile": "?0",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0"
    }
    download_images(haibao_url, haibao_folder_name, haibao_headers, cookies={})

    # 下载截图
    jietu_url = "https://www.yjwujian.cn/media/#/screenshot"
    jietu_folder_name = "yjwujian_images/jietu"
    jietu_headers = {
        "Referer": "https://www.yjwujian.cn/media/",
        "sec-ch-ua-mobile": "?0",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0"
    }
    download_images(jietu_url, jietu_folder_name, jietu_headers, cookies={})
    num = 2
    for i in range(1, 10):
        # 下载更多海报
        haibao_url = f"https://www.yjwujian.cn/inline/20v2/wallpaper/pic_index_{num}.html"
        download_images2(haibao_url, haibao_folder_name, headerstongyong, cookies={})
        num += 1

    num = 2
    for i in range(1, 14):
        # 下载更多截图
        jietu_url = f"https://www.yjwujian.cn/inline/20v1/printscreen/pic_index_{num}.html"
        download_images2(jietu_url, jietu_folder_name, headerstongyong, cookies={})
        num += 1
    
    new_final_list = [ url for url in final_list if len(str(url))>=83 ]
    print("本次爬取到url数量如下:",len(new_final_list))
    print("最终的图片链接列表如下：")
    for url in new_final_list:
        print(url)
    return new_final_list

def downwithjson(list):
    with open("urlconfig.json", "w") as f:
        for item in list:
            f.write(item+"\n")
if __name__ == '__main__':
    list = main()
    downwithjson(list)
    print('json文件生成成功！')
