from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import db_connections as db

@jwt_required()
def create_new_group():
    """
        Endpoint to create a new group.
    """
    data = request.get_json()
    username = get_jwt_identity()
    user_id_tuple = db.get_user_id_from_username_in_users_table(username)
    group_name = data.get('group_name')

    if not group_name:
        # If group name is not provided.
        return jsonify({"message": "Group name should be provided to create a group."}), 400
    
    if not user_id_tuple:
        # If user id is not found.
        return jsonify({"message": "User id is not found."}), 400
    
    user_id = user_id_tuple[0]

    result = db.add_new_group_to_groups_table(group_name, user_id)
    if result:
        return jsonify({"message": "Group created successfully!"}), 201
    else:
        return jsonify({"message": "Failed to create a group."}), 500
    
@jwt_required()
def get_name_of_creator_of_the_group():
    """
        Endpoint to retreive the name of the creator of the group.
    """
    group_name = request.args.get('group_name')

    creator_user_id = db.get_creator_user_id_from_group_name_in_group_table(group_name)

    if not creator_user_id:
        # if no creator of the group found
        return jsonify({"message": "No creator of the group found."}), 404
    
    creator_username_of_group = db.get_username_from_user_id_in_users_table(creator_user_id)

    return jsonify(creator_username_of_group), 200