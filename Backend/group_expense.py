from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import db_connections as db

# ----------------------- Endpoints for the groups table --------------------------
# ----------- Creating the group, getting the name of the group, deleting the group and updating the name of the group.

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

@jwt_required()
def update_group_name(group_name):
    """
        Function for changing the name of the group.
    """
    username = get_jwt_identity()
    data = request.get_json()  # Get JSON data from the request body
    new_group_name = data.get('new_group_name')  # Retrieve the new group name

    # Retrieve user ID from the database using the username
    user_id_tuple_result = db.get_user_id_from_username_in_users_table(username)
    user_id = user_id_tuple_result[0] if user_id_tuple_result else None

    if user_id is None:
        return jsonify({"message": "User not found."}), 404

    # Ensure the user trying to delete the group exists and is the creator of the group
    group_names = db.get_group_name_from_creator_user_id_in_group_table(user_id)

    print('Group names of the user', group_names)

    if not group_names:
        # This user is not the creator of any group
        print('Not the creator of any group')
        return jsonify({"message": "Only creator of the group can delete the group."}), 404
    
    if group_name not in group_names:
        # if the group to delete is not present in the list of group that this user has creator, means user is not creator of this group.
        print('Only creator can delete')
        return jsonify({"message": "Only creator of the group can delete the group"}), 404
    
    # Get the id of the group using name of the group and id of the creator.
    group_id = db.get_group_id_from_group_name_and_creator_user_id_in_group_table(group_name, user_id)

    # Update the group name with the new name
    result = db.update_group_name_in_groups_table_using_group_id(group_id, new_group_name)
    if result:
        return jsonify({"message": "Group name updated successfully"}), 200
    else:
        return jsonify({"message": "Failed to update group name."}), 500

@jwt_required()
def delete_group(group_name):
    """
        This function is for deleting the group. Only creator of the group is authorized to deleted the group.
        :param group_name: Name of the group to delete.
    """
    username = get_jwt_identity()

    # Retrieve user ID from the database using the username
    user_id_tuple_result = db.get_user_id_from_username_in_users_table(username)
    user_id = user_id_tuple_result[0] if user_id_tuple_result else None

    if user_id is None:
        return jsonify({"message": "User not found."}), 404

    # Ensure the user trying to delete the group exists and is the creator of the group
    group_names = db.get_group_name_from_creator_user_id_in_group_table(user_id)

    print('Group names of the user', group_names)

    if not group_names:
        # This user is not the creator of any group
        print('Not the creator of any group')
        return jsonify({"message": "Only creator of the group can delete the group."}), 404
    
    if group_name not in group_names:
        # if the group to delete is not present in the list of group that this user has creator, means user is not creator of this group.
        print('Only creator can delete')
        return jsonify({"message": "Only creator of the group can delete the group"}), 404
    
    # Get the id of the group using name of the group and id of the creator.
    group_id = db.get_group_id_from_group_name_and_creator_user_id_in_group_table(group_name, user_id)

    # Delete the group finally
    result = db.delete_group_from_groups_table_using_group_id(group_id)

    if result:
        return jsonify({"message": "Group deleted successfully!"}), 200
    else:
        return jsonify({"message": "Failed to delete group."}), 500
    
# -------------------------- Group members table related endpoints ------------------------

@jwt_required()
def add_new_member_to_group():
    """
        Endpoint to add a new member to the group.
    """
    data = request.get_json()
    username = get_jwt_identity()
    user_id_tuple = db.get_user_id_from_username_in_users_table(username)
    group_name = data.get('group_name')

    if not group_name:
        # If group name is not provided.
        return jsonify({"message": "Group name should be provided to add a member to the group."}), 400
    
    if not user_id_tuple:
        # If user id is not found.
        return jsonify({"message": "User id is not found."}), 400
    
    user_id = user_id_tuple[0]

    # Get the id of the group using group name provided
    group_id = db.get_group_id_from_group_name_in_group_table(group_name)

    if not group_id:
        # if the group where trying to add the member does not exist
        return jsonify({"message": "Cannot add a new member as this group does not exist."}), 400

    # Add new member to the group 
    result = db.add_new_member_to_group_members_table(group_id, user_id)

    if result:
        return jsonify({"message": "New member added successfully!"}), 201
    else:
        return jsonify({"message": "Failed to add new member."}), 500
    
@jwt_required()
def get_all_users_in_the_group():
    """
        Endpoint to retreive the name of all the users in a group.
    """
    group_name = request.args.get('group_name')
    if not group_name:
        # If group name is not provided.
        return jsonify({"message": "Group name should be provided to get list of all the members of the group."}), 400
    
    # Get the id of the group using group name provided
    group_id = db.get_group_id_from_group_name_in_group_table(group_name)

    if not group_id:
        # if the group where trying to add the member does not exist
        return jsonify({"message": "Cannot add a new member as this group does not exist."}), 400
    
    # Get list of all the users in the group
    result = db.get_all_user_id_using_group_id_in_group_members_table(group_id)

    if result:
        return jsonify(result), 200
    
    else:
        return jsonify({"message": "Cannot get any members in this group"}), 500
    
@jwt_required()
def delete_member_from_group(member_username, group_name):
    """
        This function is for removing a member from the group. Only creator of the group is authorized to remove the member from the group.
        :param member_username: Name of the member to remove.
    """
    username = get_jwt_identity()

    # Retrieve creator user ID from the database using the username
    user_id_tuple_result = db.get_user_id_from_username_in_users_table(username)
    user_id = user_id_tuple_result[0] if user_id_tuple_result else None

    # Get the id of the group using name of the group and id of the creator.
    group_id = db.get_group_id_from_group_name_and_creator_user_id_in_group_table(group_name, user_id)

    # retrieve the member to be removed user id from the database using its username
    member_user_id_tuple  = db.get_user_id_from_username_in_users_table(member_username)
    member_user_id = member_user_id_tuple[0] if member_user_id_tuple else None

    if user_id is None:
        return jsonify({"message": "You are not allowed to remove the member from the group."}), 404
    
    if not member_user_id:
        return jsonify({"message": "Member you are trying to delete does not exist"}), 404
    
    all_users_id_in_group = db.get_all_user_id_using_group_id_in_group_members_table(group_id)
    if not all_users_id_in_group:
        return jsonify({"message": "No member to remove from the group as there is no member in the group"}), 404
    
    if member_user_id not in all_users_id_in_group:
        # If the member to be removed is not the part of this group
        return jsonify({"message": "This member cannot be removed because of being not a part of this group."}), 404

    # Ensure the user trying to remove the member from the group exists and is the creator of the group
    group_names = db.get_group_name_from_creator_user_id_in_group_table(user_id)

    print('Group names of the user', group_names)

    if not group_names:
        # This user is not the creator of any group
        print('Not the creator of any group')
        return jsonify({"message": "Only creator of the group can remove the member of the group."}), 404
    
    if group_name not in group_names:
        # if the user trying to remove the member from the group is not the creator of the group
        print('Only creator can delete')
        return jsonify({"message": "Only creator of the group can remove the member."}), 404

    # Remove the member finally
    result = db.delete_user_from_group_members_table(member_user_id, group_id)

    if result:
        return jsonify({"message": "Group member deleted successfully!"}), 200
    else:
        return jsonify({"message": "Failed to delete group member."}), 500
    
# ------------ Group expenses endpoints ----------------------

@jwt_required()
def add_expense_to_group():
    """
        Endpoint to add expense to the group.
    """
    data = request.get_json()
    username = get_jwt_identity()
    user_id_tuple = db.get_user_id_from_username_in_users_table(username)
    group_name = data.get('group_name')
    expense_name = data.get('expense_name')
    amount = data.get('amount')

    if not all([group_name, expense_name, amount]):
        # If group name is not provided.
        return jsonify({"message": "Group name, expense_name, amount should be provided to add an expense to the group."}), 400
    
    if not user_id_tuple:
        # If user id is not found.
        return jsonify({"message": "User id is not found."}), 400
    
    user_id = user_id_tuple[0]

    # Get the id of the group using group name provided
    group_id = db.get_group_id_from_group_name_in_group_table(group_name)

    if not group_id:
        # if the group where trying to add the member does not exist
        return jsonify({"message": "Cannot add a new member as this group does not exist."}), 400

    # Add new member to the group 
    result = db.add_expense_to_group_expenses_table(group_id, expense_name, amount, user_id)

    if result:
        return jsonify({"message": "Expense added successfully!"}), 201
    else:
        return jsonify({"message": "Failed to add expense."}), 500