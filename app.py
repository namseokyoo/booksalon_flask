import os

import shortuuid
import urllib
from uuid import uuid4
from pytz import timezone
from datetime import datetime, timedelta
from flask import Flask, render_template, request, jsonify, redirect, url_for, session, make_response
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
from flask.sessions import SessionInterface, SessionMixin
from werkzeug.datastructures import CallbackDict

from book_api import getbook
from addbook import addbook


load_dotenv()
FLASKHOST = os.getenv('FLASKHOST')
PORT = os.getenv('PORT')
uri = os.getenv('URI')

client = MongoClient(uri)
db = client.booksalon

app = Flask(__name__)

app.config['SECRET_KEY'] = '1111111111111111111111'

# class MongoSession(CallbackDict, SessionMixin):
#     def __init__(self, initial=None, sid=None):
#         CallbackDict.__init__(self, initial)
#         self.sid = sid
#         self.modified = False


# class MongoSessinoInterface(SessionInterface):
#     def __init__(self, host='localhost', port=27017,
#                  db='', collection='sessions'):
#         # client = MongoClient(host, port)
#         self.store = client[db][collection]

#     def open_session(self, app, request):
#         sid = request.cookies.get(app.session_cookie_name)
#         if sid:
#             stored_session = self.store.find_one({'sid': sid})
#             if stored_session:
#                 if stored_session.get('expiration') > datetime.utcnow():
#                     return MongoSession(initial=stored_session['data'],
#                                         sid=stored_session['sid'])
#         sid = str(uuid4())
#         return MongoSession(sid=sid)

#     def save_session(self, app, session, response):
#         domain = self.get_cookie_domain(app)
#         if session is None:
#             response.delete_cookie(app.session_cookie_name, domain=domain)
#             return
#         if self.get_expiration_time(app, session):
#             expiration = self.get_expiration_time(app, session)
#         else:
#             expiration = datetime.utcnow() + timedelta(hours=1)

#         self.store.update({'sid': session.sid}, {
#             'sid': session.sid,
#             'data': session,
#             'expiration': expiration
#         }, True)
#         response.set_cookie(app.session_cookie_name,
#                             session.sid,
#                             expires=self.get_expiration_time(app, session),
#                             httponly=True, domain=domain)


# app.session_interface = MongoSessinoInterface(db='session')
# app.config.update(
#     SESSION_COOKIE_NAME='flask_session'
# )


@app.route('/')
def home():
    if 'userid' in session:
        login_id = session.get('userid', None)
    else:
        login_id = ''
    recent_booklists = list(db.booklists.find({}).sort('_id', -1).limit(3))
    recent_questionlists = list(db.questions.find({}).sort('_id', -1).limit(5))

    res = make_response(render_template(
        'index.html', recent_questionlists=recent_questionlists, recent_booklists=recent_booklists, login_id=login_id))
    # res.set_cookie(app.session_cookie_name, session.sid)
    return res
    # if recent_booklists == []:
    #     if recent_questionlists == []:
    #         return render_template('index.html')
    #     else:
    #         return render_template('index.html', recent_questionlists=recent_questionlists)
    # else:
    #     if recent_questionlists == []:
    #         return render_template('index.html', recent_booklists=recent_booklists)
    #     else:
    #         return render_template('index.html', recent_questionlists=recent_questionlists, recent_booklists=recent_booklists)


@app.route('/getuserid')
def getuserid():
    if 'userid' in session:
        login_id = session.get('userid', None)
    else:
        login_id = ''
    return jsonify({'result': 'success', 'login_id': login_id})


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('user/login.html')
    else:
        userid = request.form['userid']
        userid_db = list(db.user.find({'userid': userid}))
        if userid_db == []:
            return render_template('user/login_fail.html', msg='ID를 확인해 주세요')
        else:
            password = request.form['password']
            password_db = list(db.user.find({'userid': userid}))[0]['password']
            if password_db != password:
                return render_template('user/login_fail.html', msg='비밀번호를 확인해 주세요')
            else:
                session['userid'] = userid
                return redirect('/')


@app.route('/logout')
def logout():
    session.pop('userid', None)
    return redirect('/')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('user/register.html')
    else:
        userid = request.form['userid']
        password = request.form['password']
        re_password = request.form['repassword']
        username = request.form['username']
        email = request.form['email']

        if password != re_password:
            return render_template('user/password_fail.html')
        else:
            user_db = {
                'userid': userid,
                'password': password,
                'username': username,
                'email': email,
            }
            db.user.insert_one(user_db)
            return render_template('user/register_success.html')


@app.route('/search')
def search():
    param = request.args['param']
    infos = getbook(param)
    booklists = []
    for info in infos:
        title = info['title']
        author = info['authors']
        pubdate = info['datetime'][:10]
        isbn = info['isbn']
        publisher = info['publisher']
        imgUrl = info['thumbnail']
        contents = info['contents']
        book = {
            "title": title,
            "author": author,
            "pubdate": pubdate,
            "isbn": isbn,
            "publisher": publisher,
            "imgUrl": imgUrl,
            "contents": contents
        }
        booklists.append(book)
    return render_template('search.html', booklists=booklists, param=param)


@app.route('/bookboard')
def bookboard():
    param_isbn = request.args['book']
    book_db = list(db.booklists.find({"isbn": param_isbn}))
    if book_db == []:
        book = addbook(param_isbn)
        return render_template('bookboard.html', book=book)
    else:
        book = book_db[0]
        question_list = list(db.questions.find({'isbn': param_isbn}))
        if question_list == []:
            return render_template('bookboard.html', book=book)
        else:
            return render_template('bookboard.html', book=book, question_list=question_list)


@app.route('/write_question', methods=['get', 'post'])
def write_question():
    param_isbn = request.args['book']
    book_db = list(db.booklists.find({"isbn": param_isbn}))
    if book_db == []:
        book = addbook(param_isbn)
        db.booklists.insert_one(book)
    title = list(db.booklists.find({'isbn': param_isbn}))[0]['title']
    writer = request.form['writer']
    password = request.form['password']
    question_title = request.form['question_title']
    question = request.form['question']
    t = datetime.now() + timedelta(hours=9)
    time = t.strftime('%Y/%m/%d %H:%M:%S')
    q_id = shortuuid.uuid()
    q = {
        'q_id': q_id,
        'isbn': param_isbn,
        'title': title,
        'writer': writer,
        'password': password,
        'question_title': question_title,
        'question': question,
        'post_time': time,
        'reply': 0
    }
    db.questions.insert_one(q)
    book = list(db.booklists.find({"isbn": param_isbn}))[0]
    return redirect(f'/detail?book={param_isbn}&qid={q_id}')


@app.route('/write_reply', methods=['get', 'post'])
def write_reply():
    q_id = request.args['qid']
    reply_id = shortuuid.uuid()
    reply_writer = request.form['reply-writer']
    reply_password = request.form['reply-password']
    reply_text = request.form['reply-text']
    reply_t = datetime.now() + timedelta(hours=9)
    reply_time = reply_t.strftime('%Y/%m/%d %H:%M:%S')

    reply_db = {
        'reply_id': reply_id,
        'reply_writer': reply_writer,
        'reply_password': reply_password,
        'reply_text': reply_text,
        'reply_time': reply_time,
    }
    db.questions.update({"q_id": q_id}, {
                        "$push": {'reply_db': reply_db}
                        })
    db.questions.update({"q_id": q_id}, {
                        "$inc": {'reply': 1}
                        })
    param_isbn = list(db.questions.find({"q_id": q_id}))[0]['isbn']
    return redirect(f'/detail?book={param_isbn}&qid={q_id}')


@app.route('/write')
def wirte():
    param_isbn = request.args['book']
    book = addbook(param_isbn)
    return render_template('write.html', book=book)


@app.route('/detail')
def detail():
    param_isbn = request.args['book']
    book = list(db.booklists.find({"isbn": param_isbn}))[0]
    q_id = request.args['qid']
    detail = list(db.questions.find(
        {"$and": [{"isbn": param_isbn}, {"q_id": q_id}]}))
    return render_template("detail.html", book=book, detail=detail[0])


@app.route('/checkpw')
def checkpw():
    q_id = request.args['qid']
    type = request.args['type']
    if type == "reply":
        reply_id = request.args['reply_id']
        return render_template("checkpassword.html", q_id=q_id, reply_id=reply_id, type=type)
    else:
        return render_template("checkpassword.html", q_id=q_id, type=type)


@app.route('/check_password', methods=['get', 'post'])
def check_password():
    q_id = request.args['qid']
    pw_input = request.form["password"]
    type = request.args['type']
    param_isbn = list(db.questions.find({"q_id": q_id}))[0]['isbn']
    if type == "reply":
        reply_id = request.args['reply_id']
        pw_reply_db = list(db.questions.find(
            {"reply_db": {"$elemMatch": {"reply_id": reply_id}}}, {"reply_db": {"$elemMatch": {"reply_id": reply_id}}}))[0]['reply_db'][0]['reply_password']
        if pw_input == pw_reply_db:
            db.questions.update(
                {"q_id": q_id}, {"$pull": {"reply_db": {"reply_id": reply_id}}}, True, {"multi": True})
            db.questions.update({"q_id": q_id}, {"$inc": {'reply': -1}})
            return redirect(f'/detail?book={param_isbn}&qid={q_id}')
        else:
            return redirect(f'/detail?book={param_isbn}&qid={q_id}')
    else:
        book_db = list(db.questions.find({"q_id": q_id}))[0]
        pw_db = book_db['password']
        param_isbn = book_db['isbn']
        if pw_input == pw_db:
            db.questions.remove({"q_id": q_id})
            return redirect(f'/bookboard?book={param_isbn}')
        else:
            return redirect(f'/detail?book={param_isbn}&qid={q_id}')


@app.route('/recentbooks')
def recentbooks():
    recent_booklists = list(db.booklists.find({}).sort('_id', -1))
    return render_template('recentbooks.html', recent_booklists=recent_booklists)


@app.route('/recentquestions')
def recentquestions():
    recent_questionlists = list(db.questions.find({}).sort('_id', -1))
    return render_template('recentquestions.html', recent_questionlists=recent_questionlists)


if __name__ == "__main__":

    app.run(host=FLASKHOST, port=PORT, debug='True')
