FROM python

COPY requirements.txt /docker_test/requirements.txt
WORKDIR /docker_test
RUN pip install -r requirements.txt
COPY . /docker_test
WORKDIR /docker_test

RUN echo server will be running on 5000

CMD ["python", "app.py"]          
