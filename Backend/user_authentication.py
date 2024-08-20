from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_restful import Api, Resource
import secrets
from werkzeug.security import generate_password_hash, check_password_hash
import db_connections as db

app = Flask(__name__)

# This generates a secure random hexadecimal string of 64 characters (since 32 bytes = 64 hex characters). This string is highly secure and suitable for use as a secret key.
jwt_token_key = secrets.token_hex(32)

app.config['JWT_SECRET_KEY'] = jwt_token_key  
api = Api(app)
jwt = JWTManager(app)

class UserRegistration(Resource):
    """
    UserRegistration handles the registration of new users.
    It expects a JSON payload with 'username' and 'password'.
    The password is hashed before storing it in the simulated database.
    """
    def post(self):
        """
        Handle user registration with HTTP POST method.
        """
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        # Fetching the user details from the database using its username
        user_details = db.fetch_user(username)

        # Check if the username already exists (if user_details is not None, the user already exists)
        if user_details is not None:
            return {'message': 'User already exists'}, 400

        # Hash the password and store the user details in the database
        db.create_user(username, password)
        return {'message': 'User created successfully'}, 201


class UserLogin(Resource):
    """
        UserLogin handles the authentication of users.
        It expects a JSON payload with 'username' and 'password'.
        If the credentials are valid, it generates and returns a JWT token.
    """
    def post(self):
        """
            Handle user login with HTTP POST method.
        """
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        # Fetching the user details from the database using its username
        user_details = db.fetch_user(username)

        # Verify if the username exists and the password is correct
        if user_details is None or not check_password_hash(user_details['password_hash'], password):
            return {'message': 'Invalid credentials'}, 401
        
        # if the user's exists update it's last login time in the datase
        db.update_user_last_login_datetime(username)

        # Generate a JWT token for the user
        access_token = create_access_token(identity=username)
        return {'access_token': access_token}, 200


class ProtectedResource(Resource):
    """
        ProtectedResource demonstrates a protected endpoint.
        Access to this resource requires a valid JWT token.
        The token is verified and the current user's identity is retrieved.
    """
    @jwt_required()
    def get(self):
        """
            Handle access to protected content with HTTP GET method.
        """
        current_user = get_jwt_identity()
        return {'message': f'Hello, {current_user}! You have accessed a protected resource.'}, 200


# Adding resource endpoints to the API
api.add_resource(UserRegistration, '/register')
api.add_resource(UserLogin, '/login')
api.add_resource(ProtectedResource, '/protected')

if __name__ == '__main__':
    app.run(debug=True)