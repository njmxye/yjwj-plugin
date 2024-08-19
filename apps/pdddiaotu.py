import requests
import json

url = 'https://pifa.pinduoduo.com/pifa/search/searchOptGoods'

headers = {
  "accept": "*/*",
  "accept-language": "zh-CN,zh;q=0.9",
  "anti-content": "0arAfx5eBwCEtKMP7twNwWYSo8Z0nA2iBUCMe5x0MXuPQ8sOE6Fne2he-1FRTlUA35kz6KQZ0fXE-1S-T8-lj5A9lURPQyD_BiUrB03AF4dETlTMS2PFBgiEYcGq8BTA0oGn44iBdZo9nfDCQ_mPLPXzbsyRjswVVyCQ10Axu5BOV1Pra6_hb6yQZ0i9gVGcxCWl41LaQ5mduBJxHAQZF1de1_ds2wDLAO7etEFLVvU3Izd3Clw7SfRHS3xk-fwmKeim-ffII8VCeBxUv1lkFFI5I8wzSBAHe-f-k-sSHBxUeB2Ve-ACw3gTvsIz-1wWgsZA-1NeC1gpDqVheBx-e-VVk-VhDFVWtIw_kfV_11wgKQLtui60CJN6waAmOe-2Ck-sCD-1ZkzfKDB3CkLg0jBfVe9BDl92KAPx7IJD2PHXqOGB_cIWWlHXSnqgovniTadnXt2pOboGjDa4jgann9YOsE941Zez4cd-fFKt5Czsl_UVIm-AzAzLfOk-ROe-qFKA6hgRQHKtlwUeImIhtm-eRuHt5VSsl7S1hKDB1U0QTtg4OBfkEFs-p9cHZS14GUB5EZ4JPIPTcWP4PQTq95pgtNN3MZZtfRXKlP9axqYIPYTqnYmY6Z0efmlKFvlUXEp4aOUTZjX45Y4gq8tS0Q4S9ymyyjY0eyuy8jcvMfhE3aE3XIb3CG00mE6pga9rqHwsu5GG6OM",  "cache-control": "no-cache",
  "content-type": "application/json",
  "origin": "https://pifa.pinduoduo.com",
  "pragma": "no-cache",
  "priority": "u=1, i",
  "referer": "https://pifa.pinduoduo.com/search?cate=10232&level=2&sn=64658.3322086.0.10232&refer_page_id=64658_1723661851771_e24a1df2b",
  "sec-ch-ua-mobile": "?0",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0"
}

data={
    "page": 1,
    "size": 20,
    "sort": 0,
    "optId": 22224,
    "level": 2,
    "url": "",
    "propertyItems": []
}
data = json.dumps(data, separators=(',', ':'))

# 发送GET请求
response = requests.post(url, headers=headers, data=data)

print(response.text)