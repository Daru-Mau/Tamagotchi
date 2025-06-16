from flask import Blueprint, request, jsonify
import jwt
import datetime
from functools import wraps
import os
from werkzeug.security import generate_password_hash, check_password_hash

# Simple in-memory user storage (would be replaced with database in production)
users = {}

# Create authentication blueprint
auth = Blueprint('auth', __name__)

# Helper function to generate a token


def generate_token(user_id):
    """Generate an authentication token with expiration."""
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
            'iat': datetime.datetime.utcnow(),
            'sub': user_id
        }        # Secret key should always come from environment variables, never hardcoded
        # If JWT_SECRET_KEY is not set, raise an error instead of using a default
        jwt_secret = os.environ.get('JWT_SECRET_KEY')
        if not jwt_secret:
            raise ValueError("JWT_SECRET_KEY environment variable is not set")

        return jwt.encode(
            payload,
            jwt_secret,
            algorithm='HS256'
        )
    except Exception as e:
        return str(e)

# Decorator for protected routes


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Extract token from Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]

        if not token:
            return jsonify({'message': 'Authentication token is missing!'}), 401

        try:            # Decode and validate the token
            # Secret key should always come from environment variables, never hardcoded
            jwt_secret = os.environ.get('JWT_SECRET_KEY')
            if not jwt_secret:
                return jsonify({'message': 'Server configuration error: JWT_SECRET_KEY not set'}), 500

            payload = jwt.decode(
                token,
                jwt_secret,
                algorithms=['HS256']
            )
            user_id = payload['sub']

            # Check if user exists
            if user_id not in users:
                return jsonify({'message': 'User not found!'}), 404

        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401

        return f(user_id=user_id, *args, **kwargs)

    return decorated

# Routes for authentication


@auth.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.json

    # Check if user already exists
    if data.get('username') in users:
        return jsonify({'message': 'Username already exists!'}), 409

    # Create a new user
    username = data.get('username')
    users[username] = {
        'username': username,
        'password': generate_password_hash(data.get('password')),
        'created_at': datetime.datetime.utcnow()
    }

    # Return token
    token = generate_token(username)

    return jsonify({
        'message': 'User registered successfully!',
        'token': token
    }), 201


@auth.route('/login', methods=['POST'])
def login():
    """Login a user."""
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Check if user exists
    if username not in users:
        return jsonify({'message': 'User not found!'}), 404

    # Check password
    if check_password_hash(users[username]['password'], password):
        token = generate_token(username)
        return jsonify({
            'message': 'Login successful!',
            'token': token
        }), 200

    return jsonify({'message': 'Invalid password!'}), 401


@auth.route('/me', methods=['GET'])
@token_required
def me(user_id):
    """Get user profile."""
    user = users[user_id]
    return jsonify({
        'username': user['username'],
        'created_at': user['created_at'].isoformat()
    }), 200
