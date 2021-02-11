    import requests
import json
from faker import Faker
fake = Faker()

headers = { 'Content-Type': 'application/json' }
url = 'http://127.0.0.1:5000/api/posts/'

def create_post():
    data = {
        'title': fake.sentence(),
        'content': fake.text(),
        'author': fake.name()
    }
    resp = requests.post(url, headers=headers, data=json.dumps(data))
    print(resp.url)
    print(resp.text)

def get_all_posts():
    resp = requests.get(url, headers=headers)
    print(resp.text)


# first, create a post:
create_post()

# then, retrieve all of your posts and output them to the screen:
get_all_posts()