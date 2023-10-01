from flask import Flask, Blueprint, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import flask_praetorian
import flask_cors
from sqlalchemy import inspect
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = 'False'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']= False
app.debug = True
app.config['SECRET_KEY'] = 'mysecret'
app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 1}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}

db = SQLAlchemy(app)

guard = flask_praetorian.Praetorian()
cors = flask_cors.CORS()
CORS(app)

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    rating = db.Column(db.Integer)
    addedby = db.Column(db.String(100))


    def __repr__(self):
        return '<Movie %s>' % self.title


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True)
    password = db.Column(db.Text)
    roles = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True, server_default='true')

    
    @property
    def rolenames(self):
        try:
            return self.roles.split(',')
        except Exception:
            return []

    @classmethod
    def lookup(cls, username):
        return cls.query.filter_by(username=username).one_or_none()

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

    @property
    def identity(self):
        return self.id

    def is_valid(self):
        return self.is_active


# Initialize the flask-praetorian instance for the app
guard.init_app(app, User)
# Initializes CORS so that the flask api can talk to the react app
cors.init_app(app)


# Create a function to initialize the database
def initialize_database():
    with app.app_context():
        inspector = inspect(db.engine)
        if not inspector.has_table('User'):
            db.create_all()
        if db.session.query(User).filter_by(username='mayank').count() < 1:
            db.session.add(User(
                username='mayank',
                password=guard.hash_password('mayank'),
                roles='admin'
            ))
            db.session.commit()

'''
This part is optional, but to make sure that everything is obvious, 
we can set a __repr__ method to make every single post object is printable to the console.
'''

# Set up some routes for the example
@app.route('/')
def home():
  	return {"Hello": "Home Route"}, 200


@app.route('/api/username',methods=['GET'])
@flask_praetorian.auth_required #decorator 
def getusername():
    current_user=User.lookup(flask_praetorian.current_user().username)
    print(current_user.username)
    return {'user': current_user.username}

@app.route('/api/login', methods=['POST'])
def login():
    """
    Logs a user in by parsing a POST request containing user credentials and
    issuing a JWT token.
    .. example::
       $ curl http://localhost:5000/api/login -X POST \
         -d '{"username":"mayank","password":"mayank"}'
    """
    req = request.get_json(force=True)
    username = req.get('username', None)
    password = req.get('password', None)
    user = guard.authenticate(username, password)
    ret = {'access_token': guard.encode_jwt_token(user)}
    return ret, 200

@app.route('/api/refresh', methods=['POST'])
def refresh():
    """
    Refreshes an existing JWT by creating a new one that is a copy of the old
    except that it has a refrehsed access expiration.
    .. example::
       $ curl http://localhost:5000/refresh -X GET \
         -H "Authorization: Bearer <your_token>"
    """
    print("refresh request")
    old_token = request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    ret = {'access_token': new_token}
    return ret, 200

@app.route('/api/protected')
@flask_praetorian.auth_required #decorator 
def protected():
    """
    A protected endpoint. The auth_required decorator will require a header
    containing a valid JWT
    .. example::
       $ curl http://localhost:5000/api/protected -X GET \
         -H "Authorization: Bearer <your_token>"
    """
    return {"message": f'protected endpoint (Hi {flask_praetorian.current_user().username})'}
	

@app.route('/add_movie', methods=['POST'])
@flask_praetorian.auth_required #decorator 
def add_movie():
    movie_data = request.get_json()

    new_movie = Movie(title=movie_data['title'], rating=movie_data['rating'],addedby=flask_praetorian.current_user().username)

    db.session.add(new_movie)
    db.session.commit()

    return 'Done',201


@app.route('/api/register', methods=['POST'])
def register():
    users = request.get_json()
    db.session.add(User(
              username=users['username'],
              password=guard.hash_password(users['password']),
              roles='admin'
            )) 
    db.session.commit()

    return 'Done',201



@app.route('/get_max_id', methods=['GET'])
def get_max_id():
    maxid = []
    maxid = Movie.query.order_by(Movie.id.desc()).first()
    return  jsonify({'id' : maxid.id})

@app.route('/delete_movie/<int:movie_id>', methods=['POST'])
def delete_movie(movie_id):
    delete_movie = Movie.query.filter_by(id=movie_id).delete()

    db.session.commit()

    return 'Done', 204


@app.route('/update_movie/<int:movie_id>', methods=['POST'])
def update_movie(movie_id):
    movie_data = request.get_json()

    delete_movie = Movie.query.filter_by(id=movie_id).update(dict(title=movie_data['title']))
    db.session.commit()

    return 'Done', 201

@app.route('/movies')
@flask_praetorian.auth_required #decorator 
def movies():
    movie_list = Movie.query.all()
    movies = []

    for movie in movie_list:
        movies.append({'id':movie.id,'title' : movie.title, 'rating' : movie.rating,'addedby':movie.addedby})

    return jsonify({'movies' : movies})


@app.route('/users')
@flask_praetorian.auth_required #decorator
def users():
    user_list = User.query.all()
    users = []

    for user in user_list:
        users.append({'id':user.id,'username' : user.username, 'password' : user.password,'role':user.roles,'is_active':user.is_active})

    return jsonify({'users' : users})


if __name__ == '__main__':
    initialize_database()
    app.run(port=5000,host='0.0.0.0',debug=True)