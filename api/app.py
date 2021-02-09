from flask import Flask
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)
if __name__ == '__main__':
    app.run()


@app.route('/')
def get_article():
    page_link, title, first_paragraph = get_wiki_article()

    return {
        "link": "https://" + page_link,
        "title": title,
        "firstParagraph": first_paragraph
    }


def get_wiki_article():
    wikipedia_article_html = get_wikipedia_random_article_html()
    title = get_article_title(wikipedia_article_html)
    page_link = get_article_link(wikipedia_article_html)
    article_first_paragraph = get_article_firstParragraph(wikipedia_article_html)
    return page_link, title, article_first_paragraph


def get_article_firstParragraph(wikipedia_article_html):
    body_content = wikipedia_article_html.find(id='bodyContent')
    content_text = body_content.find(id="mw-content-text")
    aux_div = content_text.find(class_="mw-parser-output")
    return aux_div.p.text


def get_article_link(wikipedia_article_html):
    return wikipedia_article_html.find(rel='alternate')['href']


def get_article_title(wikipedia_article_html):
    return wikipedia_article_html.title.string


def get_wikipedia_random_article_html():
    random_wiki_article_response = requests.get('https://es.wikipedia.org/wiki/Especial:Aleatoria')
    random_wiki_article_page_text = random_wiki_article_response.text
    wiki_html = BeautifulSoup(random_wiki_article_page_text, 'html.parser')
    return wiki_html
