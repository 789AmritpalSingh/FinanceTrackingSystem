from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_restful import Resource
from werkzeug.security import generate_password_hash, check_password_hash
import db_connections as db


class UserRegistration(Resource):
    """
    UserRegistration handles the registration of new users.
    It expects a JSON payload with 'email', 'username' and 'password'.
    The password is hashed before storing it in the simulated database.
    """

    def post(self):
        data = request.get_json()
        email = data.get("email")
        username = data.get("username")
        password = data.get("password")

        user_details = db.fetch_user_details(username)
        if user_details is not None:
            return {"message": "User already exists"}, 400

        db.create_user(email, username, password)

        db.update_user_as_logged_in(username)
        # Automatically generate a JWT token for the new user
        access_token = create_access_token(identity=username)

        # Return the token and success message
        return {
            "message": "User created successfully",
            "access_token": access_token,
        }, 201


class UserLogin(Resource):
    """
    UserLogin handles the authentication of users.
    It expects a JSON payload with 'username' and 'password'.
    If the credentials are valid, it generates and returns a JWT token.
    """

    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        user_details = db.fetch_user_details(username)
        if user_details is None or not check_password_hash(
            user_details["password_hash"], password
        ):
            return {"message": "Invalid credentials"}, 401

        db.update_user_as_logged_in(username)
        access_token = create_access_token(identity=username)
        return {"access_token": access_token}, 200


class ProtectedResource(Resource):
    """
    ProtectedResource demonstrates a protected endpoint.
    Access to this resource requires a valid JWT token.
    The token is verified and the current user's identity is retrieved.
    """

    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        return {
            "message": f"Hello, {current_user}! You have accessed a protected resource."
        }, 200


@jwt_required()
def get_user_account_info():
    """
    Endpoint to retrieve user account information from the database using its username.
    """
    username = get_jwt_identity()

    if not username:
        return jsonify({"message": "No username provided."}), 404

    user_account_info = db.fetch_user_details(username)
    if not user_account_info:
        return (
            jsonify({"message": "This user is not associated with any account."}),
            404,
        )

    # If all good then return the user account information
    return jsonify(user_account_info), 200


@jwt_required()
def update_user_as_logged_out():
    """
    Function for updating the user status as logged out.
    """
    username = get_jwt_identity()

    if not username:
        return jsonify({"message": "No username provided."}), 404

    user_account_info = db.fetch_user_details(username)
    if not user_account_info:
        return (
            jsonify({"message": "This user is not associated with any account."}),
            404,
        )

    # Updat user as logged out
    result = db.update_user_as_logged_out(username)

    if result:
        return jsonify({"message": "User logged out status updated successfully!"}), 200
    else:
        return (
            jsonify({"message": "Failed to update log out status for given user."}),
            500,
        )
