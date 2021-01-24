'''
To run on command line:
export FLASK_APP=app.py
export FLASK_ENV=development
flask run
'''

from flask import Flask, request, Response
import db
from views import posts, comments
import datetime

app = Flask(__name__)
db.init_database_connection(app)

# connect your routes to your app:
@app.route('/')
def home_page():
    return 'Today is the inauguration: {0}'.format(datetime.datetime.now())

@app.route('/wednesday')
def wednesday():
    return 'Demo'
    
# routes from other files:
app.register_blueprint(posts.api)
app.register_blueprint(comments.api)


if __name__ == "__main__":
    print('running!')
    app.run(debug=True)