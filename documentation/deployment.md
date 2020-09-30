Heroku Deployment Steps

1) Install guinicorn locally
pipenv install gunicorn
or
pip install gunicorn

2) Install Heroku CLI
https://devcenter.heroku.com/articles/heroku-cli

3) Login via CLI
heroku login

4) Create app
heroku create appname

5) Create database
heroku addons:create heroku-postgresql:hobby-dev --app appname

6) Get URI
heroku config --app appname

# Add to your app
7) Create Procfile
touch Procfile

# Add this
web: gunicorn app:app

8) Create requirements.txt
pip freeze > requirements.txt

9) Create runtime.txt
touch runtime.txt

# Add this
python-3.7.2

10) Deploy with Git
git init
git add . && git commit -m 'Deploy'
heroku git:remote -a appname
git push heroku master

11) Add table to remote database
heroku run python
>>> from app import db
>>> db.create_all()
>>>exit()

12) Visit app
heroku open