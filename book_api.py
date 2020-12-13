import os

import requests
import json
import urllib
from dotenv import load_dotenv

load_dotenv()


def getbook(booktitle):
    KAKAO_API_KEY = os.getenv('KAKAO_API_KEY')
    user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3862.120 Safari/537.36"
    session = requests.Session()
    session.headers.update({'User-agent': user_agent,
                            'referer': None, 'Authorization': KAKAO_API_KEY})
    url_tpl = "https://dapi.kakao.com/v3/search/book"

    title = booktitle
    page = 1
    size = 50

    documents = []

    for i in range(0, 2):

        page = i + 1

        # params = {"page": page, "size": size, "query": q}
        params = {"size": size, "query": title}

        query = urllib.parse.urlencode(params)

        api_url = url_tpl + "?" + query

    r = session.get(api_url)

    if r.status_code != 200:
        # print("[%d Error] %s" % (r.status_code, r.reason))
        quit()

    r.encoding = "urf-8"
    book_dict = json.loads(r.text)

    documents += book_dict['documents']
    # print(documents)
    return(documents)
