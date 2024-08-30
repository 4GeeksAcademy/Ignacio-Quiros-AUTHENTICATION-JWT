import os
from flask import Flask, request, jsonify, send_from_directory
from flask_migrate import Migrate
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from datetime import timedelta
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# Setup JWT 
app.config["JWT_SECRET_KEY"] = os.getenv("JWT-KEY")
jwt = JWTManager(app)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=2)

# Configuración de CORS
cors = CORS(app, resources={r"/*": {"origins": "https://improved-telegram-gj99xprvv9gc96px-3000.app.github.dev"}})

bcrypt = Bcrypt(app)

# database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)
setup_commands(app)

# Add all endpoints from the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

@app.route("/register", methods=["POST"])
def register():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'Body is required'}), 400
    if 'email' not in body:
        return jsonify({'msg': 'Field "email" is required'}), 400
    if 'password' not in body:
        return jsonify({'msg': 'Field "password" is required'}), 400
    
    existing_user = User.query.filter_by(email=body['email']).first()
    if existing_user:
        return jsonify({'msg': 'Email already exists in the database'}), 400
    is_active = body.get('is_active', True)

    try:
        pw_hash = bcrypt.generate_password_hash(body['password']).decode('utf-8')
        new_user = User(email=body['email'], password=pw_hash, is_active=is_active)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'msg': 'New User Created'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': str(e)}), 500

@app.route("/login", methods=["POST"])
def login():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'Body is required'}), 400
    if 'email' not in body:
        return jsonify({'msg': 'Field "email" is required'}), 400
    if 'password' not in body:
        return jsonify({'msg': 'Field "password" is required'}), 400

    user = User.query.filter_by(email=body['email']).first()
    if not user or not bcrypt.check_password_hash(user.password, body['password']):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=user.email)
    return jsonify(access_token=access_token), 200

@app.route("/private", methods=["GET"])
@jwt_required()
def get_private_info():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()

    return jsonify({'msg': 'Info correct, you logged in!',
                    'user_data': {'email': user.email, 'is_active': user.is_active}})

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
