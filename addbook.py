from book_api import getbook


def addbook(isbn):
    addbook = getbook(isbn.split(" ")[0])[0]
    title = addbook['title']
    author = addbook['authors']
    pubdate = addbook['datetime'][:10]
    isbn = addbook['isbn']
    publisher = addbook['publisher']
    imgUrl = addbook['thumbnail']
    contents = addbook['contents']
    book = {
        "title": title,
        "author": author,
        "pubdate": pubdate,
        "isbn": isbn,
        "publisher": publisher,
        "imgUrl": imgUrl,
        "contents": contents
    }
    return book
