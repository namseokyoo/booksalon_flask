import os

import shortuuid
from pytz import timezone
from datetime import datetime
from flask import Flask, render_template, request, jsonify, redirect
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
from book_api import getbook


load_dotenv()
HOST = os.getenv('HOST')
USERNAME = os.getenv('USERNAME')
PASSWORD = os.getenv('PASSWORD')
# client = MongoClient('localhost', 27017)
client = MongoClient(HOST,
                     27017,
                     username=USERNAME,
                     password=PASSWORD,
                     authMechanism='SCRAM-SHA-1')
db = client.booksalon

app = Flask(__name__)


@app.route('/')
def home():
    question_list = list(db.questions.find({}))
    if question_list == []:
        return render_template('index.html')
    else:
        id = question_list[0]['_id']
        return render_template('index.html', question_list=question_list)


@app.route('/write_question', methods=['post'])
def write_question():
    writer = request.form['writer']
    password = request.form['password']
    question_title = request.form['question_title']
    question = request.form['question']
    time = datetime.now(timezone('Asia/Seoul'))
    q = {
        'writer': writer,
        'password': password,
        'question_title': question_title,
        'question': question,
        'post_time': time,
        'reply': 0
    }
    db.questions.insert_one(q)
    return redirect('/')


@app.route('/write_reply', methods=['get', 'post'])
def write_reply():
    id = request.args['id']
    reply_id = shortuuid.uuid()
    reply_writer = request.form['reply-writer']
    reply_password = request.form['reply-password']
    reply_text = request.form['reply-text']
    reply_time = datetime.now(timezone('Asia/Seoul'))
    reply_db = {
        'reply_id': reply_id,
        'reply_writer': reply_writer,
        'reply_password': reply_password,
        'reply_text': reply_text,
        'reply_time': reply_time,
    }
    db.questions.update({"_id": ObjectId(id)}, {
                        "$push": {'reply_db': reply_db}
                        })
    db.questions.update({"_id": ObjectId(id)}, {
                        "$inc": {'reply': 1}
                        })
    return redirect(f'/detail?id={id}')


@app.route('/write')
def wirte():
    return render_template('write.html')


@app.route('/detail')
def detail():
    id = request.args['id']
    detail = list(db.questions.find({"_id": ObjectId(id)}))
    # time = detail[0]['time']
    # print(time)
    return render_template("detail.html", detail=detail[0])


@app.route('/checkpw')
def checkpw():
    id = request.args['id']
    type = request.args['type']
    if type == "reply":
        reply_id = request.args['reply_id']
        return render_template("checkpassword.html", id=id, reply_id=reply_id, type=type)
    else:
        return render_template("checkpassword.html", id=id, type=type)


@app.route('/check_password', methods=['get', 'post'])
def check_password():
    id = request.args['id']
    pw_input = request.form["password"]
    type = request.args['type']
    if type == "reply":
        reply_id = request.args['reply_id']
        pw_reply_db = list(db.questions.find(
            {"reply_db": {"$elemMatch": {"reply_id": reply_id}}}, {"reply_db": {"$elemMatch": {"reply_id": reply_id}}}))[0]['reply_db'][0]['reply_password']
        if pw_input == pw_reply_db:
            db.questions.update(
                {"_id": ObjectId(id)}, {"$pull": {"reply_db": {"reply_id": reply_id}}}, True, {"multi": True})
            db.questions.update({"_id": ObjectId(id)}, {"$inc": {'reply': -1}})
            return redirect(f'/detail?id={id}')
        else:
            return redirect(f'/detail?id={id}')
    else:
        pw_db = list(db.questions.find({"_id": ObjectId(id)}))[0]['password']
        if pw_input == pw_db:
            db.questions.remove({"_id": ObjectId(id)})
            return redirect('/')
        else:
            return redirect(f'/detail?id={id}')


if __name__ == "__main__":
    # app.run(host='localhost', port=5000, debug='True')
    app.run(host='0.0.0.0', port=80, debug='True')
