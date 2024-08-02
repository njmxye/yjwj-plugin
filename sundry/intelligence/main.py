import json
import time
import re
import requests

def load_config():
    return json.load(open('./plugins/yjwj-plugin/sundry/intelligence/config.json', encoding='utf-8'))


def write_tokens(auth_token, refresh_token):
    cfg = load_config()
    cfg['auth_token'] = auth_token
    cfg['refresh_token'] = refresh_token
    with open('./plugins/yjwj-plugin/sundry/intelligence/config.json', 'w', encoding='utf-8') as w:
        w.write(json.dumps(cfg))


def get_chat_url(
    chat_id): return f'https://kimi.moonshot.cn/api/chat/{chat_id}/completion/stream'


REFRESH_INTERVAL = 5 * 60
REFRESH_URL = 'https://kimi.moonshot.cn/api/auth/token/refresh'
LIST_URL = 'https://kimi.moonshot.cn/api/chat/list'
NEW_CHAT_URL = 'https://kimi.moonshot.cn/api/chat'

HEADERS = {
    'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0',
    'Content-Type': 'application/json',
    'Referer': 'https://kimi.moonshot.cn',
    'Origin': 'https://kimi.moonshot.cn',
}


def list_conversations():
    response = requests.post(LIST_URL, headers=HEADERS, json={}).json()
    return response['items']


def create_conversation(name):
    response = requests.post(NEW_CHAT_URL,
                             headers=HEADERS,
                             json={'name': name}).json()
    return response['id']


def format_url(text):
    url_pattern = r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
    urls = re.findall(url_pattern, text)
    for url in urls:
        new_url = f'<url id="" type="url" status="" title="" wc="">{url}</url>'
        text = text.replace(url, new_url)
    return text


def process_msg(messages):
    concat_content = ''
    for msg in messages:
        role, content = msg['role'], msg['content']
        single_msg = f'{role}: {content}\n\n'
        concat_content += single_msg
    concat_content = format_url(concat_content)
    return [{'content': concat_content, 'role': 'user'}]


async def get_reply(messages):
    HEADERS['Authorization'] = load_config()['auth_token']
    chat_id = create_conversation('新的聊天')
    chat_url = get_chat_url(chat_id)
    concat_msg = process_msg(messages)
    response = requests.post(chat_url,headers=HEADERS,json={'messages': concat_msg})
    status_code = response.status_code
    if status_code != 200:
        print(status_code)
        print(response.content.decode('utf-8'))
    else:
        search_content = '\n\n参考：\n'
        url = None
        link_count = 1
        for r in response.iter_lines():
            if r:
                decoded = r.decode('utf-8')
                if decoded.startswith('data:'):
                    json_data = json.loads(decoded[len('data: '):])
                    if json_data['event'] == 'cmpl':
                        answer = json_data['text']
                        yield json.dumps(
                            {
                                'object': 'chat.completion.chunk',
                                'model': 'moonshot-v1',
                                'choices': [
                                    {
                                        'delta':  {'content': answer},
                                        'index': 0,
                                        'finish_reasosn': None,
                                    }
                                ],
                            }
                        )

                    elif json_data['event'] == 'search_plus':
                        msg = json_data['msg']
                        if 'url' in msg:
                            title, url = msg['title'], msg['url']
                            search_content += f'{link_count}. [{title}]({url})\n'
                            link_count += 1
    if url is not None:
        yield json.dumps(
            {
                'object': 'chat.completion.chunk',
                'model': 'moonshot-v1',
                'choices': [
                    {
                        'delta':  {'content': search_content},
                        'index': 0,
                        'finish_reason': 'search',
                    }
                ],
            }
        )

    yield json.dumps(
        {
            'object': 'chat.completion.chunk',
            'model': 'moonshot-v1',
            'choices': [
                {
                    'delta':  {},
                    'index': 0,
                    'finish_reason': 'stop',
                }
            ],
        }
    )


def refresh():
    global refresh_token
    refresh_token = load_config()['refresh_token']
    HEADERS['Authorization'] = refresh_token
    response = requests.get(REFRESH_URL, headers=HEADERS).json()
    auth_token, refresh_token = list(response.values())
    refresh_token = f'Bearer {refresh_token}'
    auth_token = f'Bearer {auth_token}'
    write_tokens(auth_token, refresh_token)


if __name__ == '__main__':
    while True:
        refresh()
        print('Refresh......')
        time.sleep(REFRESH_INTERVAL)
