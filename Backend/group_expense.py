from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import db_connections as db
from datetime import datetime

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

    # Create the new group and get the full row details
    new_group = db.add_new_group_to_groups_table(group_name, user_id)

    # Check if the group was created successfully and has details
    if new_group:
        # Add the creator as a member of the group
        db.add_new_member_to_group_members_table(new_group["id"], user_id)
        
        # Return the full group details in the response
        return jsonify({"message": "Group created successfully!", "data": new_group}), 201
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
def update_group_name(group_id):
    """
        Function for changing the name of the group.
        :param group_id: ID of the group for which to change the name.
    """
    username = get_jwt_identity()
    data = request.get_json()  # Get JSON data from the request body
    new_group_name = data.get('new_group_name')  # Retrieve the new group name

    # Retrieve user ID from the database using the username
    user_id_tuple_result = db.get_user_id_from_username_in_users_table(username)
    user_id = user_id_tuple_result[0] if user_id_tuple_result else None

    if user_id is None:
        return jsonify({"message": "User not found."}), 404

    # Ensure the user trying to update the group name is the creator of the group
    creator_user_id = db.get_creator_user_id_from_group_id_in_groups_table(group_id)
    
    if creator_user_id != user_id:
        # if the user trying to update the group name is not the creator of the group
        return jsonify({"message": "Only creator of the group can update the group name"}), 404

    # Update the group name with the new name
    result = db.update_group_name_in_groups_table_using_group_id(group_id, new_group_name)
    if result:
        return jsonify({"message": "Group name updated successfully"}), 200
    else:
        return jsonify({"message": "Failed to update group name."}), 500

@jwt_required()
def delete_group(group_id):
    """
        This function is for deleting the group. Only creator of the group is authorized to deleted the group.
        :param group_id: ID of the group to delete.
    """
    username = get_jwt_identity()

    # Retrieve user ID from the database using the username
    user_id_tuple_result = db.get_user_id_from_username_in_users_table(username)
    user_id = user_id_tuple_result[0] if user_id_tuple_result else None

    if user_id is None:
        return jsonify({"message": "User not found."}), 404

    # Ensure the user trying to delete the group name is the creator of the group
    creator_user_id = db.get_creator_user_id_from_group_id_in_groups_table(group_id)
    
    if creator_user_id != user_id:
        # if the user trying to delete the group is not the creator of the group
        return jsonify({"message": "Only creator of the group can delete the group"}), 404
    
    # Delete all the expenses and expense shares from the group
    expenses_deleted = db.delete_group_expenses_by_group_id(group_id)

    if expenses_deleted:
        # Only if the expenses were deleted, delete all the group members
        group_members_removed = db.delete_all_members_from_group_members_table(group_id)

        if group_members_removed:
            # If groups members were removed from the group successfully

            # Delete the group finally
            group_deleted = db.delete_group_from_groups_table_using_group_id(group_id)

            if group_deleted:
                return jsonify({"message": "Group deleted successfully!"}), 200
            else:
                return jsonify({"message": "Failed to delete group."}), 500

        else:
            return jsonify({"message": "Failed to remove members from the group."}), 500  
        
    else:
        return jsonify({"message": "Failed to delete all the expenses and expense shares from the group."}), 500  
        
    
# -------------------------- Group members table related endpoints ------------------------

@jwt_required()
def add_new_member_to_group():
    """
        Endpoint to add a new member to the group.
    """
    data = request.get_json()
    username = data.get('username')  # Username of the user getting added to the group
    user_id_tuple = db.get_user_id_from_username_in_users_table(username)
    group_id = data.get('group_id')

    # Convert group_id to integer for comparison
    try:
        group_id = int(group_id)
    except ValueError:
        return jsonify({"message": "Invalid group ID format."}), 400

    if not group_id:
        # If group name is not provided.
        return jsonify({"message": "Group id should be provided to add a member to the group."}), 400
    
    if not user_id_tuple:
        # If user id is not found.
        return jsonify({"message": "User not found."}), 400
    
    user_id = user_id_tuple[0]

    all_group_ids = db.get_all_group_ids_from_groups_table()

    if group_id not in all_group_ids:
        # if the group where trying to add the member does not exist
        return jsonify({"message": "Cannot add a new member as this group does not exist."}), 400
    
    # Add new member to the group 
    new_member_details, username = db.add_new_member_to_group_members_table(group_id, user_id)

    if new_member_details:
        return jsonify({"message": "New member added successfully!", "new_member_details": new_member_details, "username": username}), 201
    else:
        return jsonify({"message": "Failed to add new member."}), 500
    
@jwt_required()
def get_all_users_in_the_group():
    """
        Endpoint to retreive the name of all the users in a group.
    """
    group_id = request.args.get('group_id')
    if not group_id:
        # If group id is not provided.
        return jsonify({"message": "Group id should be provided to get list of all the members of the group."}), 400
    
    # Convert group_id to integer for comparison
    try:
        group_id = int(group_id)
    except ValueError:
        return jsonify({"message": "Invalid group ID format."}), 400

    all_group_ids = db.get_all_group_ids_from_groups_table()

    if group_id not in all_group_ids:
        # if the group where trying to add the member does not exist
        return jsonify({"message": "Cannot get the list of all the members in the group as this group does not exist."}), 400
    
    # Get list of all the users in the group
    group_members = db.get_all_users_using_group_id_in_group_members_table(group_id)

    if group_members:
        return jsonify({"data": group_members}), 200
    
    else:
        return jsonify({"message": "Cannot find any members in this group", "data": []}), 500
    
@jwt_required()
def get_all_group_names_user_is_involved_in():
    """
        Endpoint to retreive the name of all the groups the user is involved in.
    """
    username = get_jwt_identity()

    # Retrieve user ID from the database using the username
    user_id_tuple_result = db.get_user_id_from_username_in_users_table(username)
    user_id = user_id_tuple_result[0] if user_id_tuple_result else None

    if user_id is None:
        return jsonify({"message": "User not found."}), 404
    
    # Get details of all the groups in which particular user is involved in.
    groups_details = db.get_groups_details_for_user(user_id)

    if groups_details:
        return jsonify({"data": groups_details}), 200
    
    else:
        return jsonify({"message": "Cannot find any group for this user.", "data": []}), 500
    
@jwt_required()
def delete_member_from_group(member_id, group_id):
    """
        This function is for removing a member from the group. Only creator of the group is authorized to remove the member from the group.
        :param member_id: ID of the member of the group to remove.
        :param group_id: ID of the group.
    """
    username = get_jwt_identity()

    # Retrieve user trying to delete user ID from the database using the username
    user_id_tuple_result = db.get_user_id_from_username_in_users_table(username)
    user_id = user_id_tuple_result[0] if user_id_tuple_result else None

    group_creator_user_id = db.get_creator_user_id_from_group_id_in_groups_table(group_id)

    if user_id != group_creator_user_id:
        # If user is not the creator of the group.
        return jsonify({"message": "You are not allowed to remove the member from the group."}), 404
    
    if not member_id:
        return jsonify({"message": "Member you are trying to delete does not exist"}), 404

    # Remove the member finally
    result = db.delete_user_from_group_members_table(member_id, group_id)

    if result:
        return jsonify({"message": "Group member deleted successfully!"}), 200
    else:
        return jsonify({"message": "Failed to delete group member."}), 500
    
# ------------ Group expenses endpoints ----------------------

def calculate_expense_split(amount, split_between, custom_shares=None):
    """
        Function for calculating the split shares for the members in the split_between list provided.
        :param amount: Total amount of the expense.
        :param split_between: List of user_ids to split the expense between.
        :param custom_shares: Optional dictionary with user_ids as keys and their respective share amounts. If provided, will overrride equal split and use custom shares.
        :return: Dictionary with user_ids as keys and their calculated share amounts.
    """
    expense_shares = {}
    if custom_shares:
        # custom split specified
        expense_shares = custom_shares
    else:
        # Equal split
        share_amount = amount / len(split_between)
        expense_shares = {user_id: share_amount for user_id in split_between}

    return expense_shares

@jwt_required()
def add_expense_to_group(custom_shares=None):
    """
        Endpoint to add expense to the group.
    """
    data = request.get_json()
    username = get_jwt_identity()
    user_id_tuple = db.get_user_id_from_username_in_users_table(username)
    group_id = data.get('group_id')
    expense_name = data.get('expense_name')
    amount = data.get('amount')
    paid_by = data.get('paid_by')
    split_between = data.get('split_between')  # List of user_ids to split the expense between

    print(f'Split between - {split_between}, paid by - {paid_by}')

    if not all([group_id, expense_name, paid_by, amount, split_between]):
        # If group name is not provided.
        return jsonify({"message": "All fields must be provided to add an expense to the group."}), 400
    
    if not user_id_tuple:
        # If user id is not found.
        return jsonify({"message": "User id is not found."}), 400
    
    user_id = user_id_tuple[0]

    all_group_ids = db.get_all_group_ids_from_groups_table()

    if group_id not in all_group_ids:
        # if the group where trying to add the member does not exist
        return jsonify({"message": "Cannot add expense to this group as this group does not exist."}), 400

    # Add expense to the group 
    expense_details = db.add_expense_to_group_expenses_table(group_id, expense_name, amount, paid_by)  # This returns the added expense id

    if expense_details:
        # Calculate expense shares between each member
        expense_shares = calculate_expense_split(amount, split_between, custom_shares)

        # Update the user balances table with the new balance
        updated_user_balances = db.update_user_balances(group_id, paid_by, expense_shares)

        if not updated_user_balances:
            return jsonify({"message": "Failed to update the user balances"}), 500

        # Insert each member's share into the expense shares table
        for member_id, share_amount in expense_shares.items():
            direction = "owes" if member_id != paid_by else "is_owed"
            share_amount = share_amount if member_id != paid_by else (amount - share_amount) 
            status = "pending"
            settled = False
            settled_date = None

            share_added = db.add_expense_share(
                expense_id=expense_details["id"],
                user_id=member_id,
                share_amount=share_amount,
                status=status,
                direction=direction,
                settled=settled,
                settled_date=settled_date
            )

            if not share_added:
                return jsonify({"message": f"Failed to add share for user_id {member_id}", "expense_details": []}), 500
            
        return jsonify({"message": "Expense added and split successfully!", "expense_details": expense_details}), 201
    else:
        return jsonify({"message": "Failed to add expense."}), 500

@jwt_required()
def get_user_balances():
    """
        Endpoint to retreive the balances of the users in a group.
    """
    username = get_jwt_identity()

    # Retrieve user ID from the database using the username
    user_id_tuple_result = db.get_user_id_from_username_in_users_table(username)
    user_id = user_id_tuple_result[0] if user_id_tuple_result else None

    if user_id is None:
        return jsonify({"message": "User not found."}), 404

    group_id = request.args.get('group_id')
    
    if not group_id:
        # If group id is not provided.
        return jsonify({"message": "Group id should be provided to get list of all the balances in this group."}), 400
    
    # Convert group_id to integer for comparison
    try:
        group_id = int(group_id)
    except ValueError:
        return jsonify({"message": "Invalid group ID format."}), 400


    all_group_ids = db.get_all_group_ids_from_groups_table()

    if group_id not in all_group_ids:
        # if the group where trying to add the member does not exist
        return jsonify({"message": "Cannot get the list of all the balances in the group as this group does not exist."}), 400
    
    # Get list of all the balances in the group for particular user
    user_balances = db.get_user_balances_from_user_balances_table(user_id, group_id)

    if user_balances:
        return jsonify({"balances": user_balances}), 200
    
    else:
        return jsonify({"message": "Cannot find any balance in this group", "balances": []}), 500
    
@jwt_required()
def settle_expense():
    """
        Endpoint to settle an expense for a specific user.
    """
    data = request.get_json()
    username = get_jwt_identity()
    user_id_tuple = db.get_user_id_from_username_in_users_table(username)
    user_id = user_id_tuple[0] if user_id_tuple else None

    if not user_id:
        return jsonify({"message": "User not found."}), 404

    expense_id = data.get('expense_id')
    member_id = data.get('member_id')  # The user with whom the settlement is made

    if not all([expense_id, member_id]):
        return jsonify({"message": "Both expense_id and member_id are required."}), 400

    # Fetch the specific share details
    share_details = db.get_share_details_using_expense_id_and_user_id(expense_id, member_id)
    if not share_details:
        return jsonify({"message": "Expense share not found for this user."}), 404

    # Update the share details to mark it as settled
    share_id = share_details['id']
    settled_date = datetime.now()

    update_result = db.update_expense_share_in_expense_shares_table_using_share_id(
        share_id=share_id,
        status="settled",
        settled=True,
        settled_date=settled_date
    )

    if update_result:
        return jsonify({"message": "Expense settled successfully!"}), 200
    else:
        return jsonify({"message": "Failed to settle expense."}), 500

@jwt_required()
def settle_all_expenses_with_user():
    """
        Endpoint to settle all pending expenses with a specific user.
    """
    data = request.get_json()
    username = get_jwt_identity()
    user_id_tuple = db.get_user_id_from_username_in_users_table(username)
    user_id = user_id_tuple[0] if user_id_tuple else None

    if not user_id:
        return jsonify({"message": "User not found."}), 404

    # The user with whom the settlement is being made
    settle_with_user_id = data.get('settle_with_user_id')

    if not settle_with_user_id:
        return jsonify({"message": "settle_with_user_id is required."}), 400

    # Retrieve all pending shares between the authenticated user and the specified user
    pending_shares = db.get_pending_shares_between_users(user_id, settle_with_user_id)
    
    if not pending_shares:
        return jsonify({"message": "No pending shares to settle with this user."}), 404

    # Update each share to mark it as settled
    settled_date = datetime.now()
    for share in pending_shares:
        share_id = share['id']
        update_result = db.update_expense_share_in_expense_shares_table_using_share_id(
            share_id=share_id,
            status="settled",
            settled=True,
            settled_date=settled_date
        )
        
        if not update_result:
            return jsonify({"message": f"Failed to settle share with id {share_id}"}), 500

    return jsonify({"message": "All expenses settled with specified user successfully!"}), 200


@jwt_required()
def get_all_expenses_in_the_group():
    """
        Endpoint to retreive all the expenses in a group.
    """
    group_id = request.args.get('group_id')
    if not group_id:
        # If group id is not provided.
        return jsonify({"message": "Group id should be provided to get list of all the expenses of the group."}), 400
    
    # Convert group_id to integer for comparison
    try:
        group_id = int(group_id)
    except ValueError:
        return jsonify({"message": "Invalid group ID format."}), 400

    all_group_ids = db.get_all_group_ids_from_groups_table()

    if group_id not in all_group_ids:
        # if the group where trying to add the member does not exist
        return jsonify({"message": "Cannot get the list of all the expenses in the group as this group does not exist."}), 400
    
    # Get list of all the expenses in the group
    group_expenses = db.get_all_expenses_details_for_a_particular_group_from_group_expenses_table(group_id)

    if group_expenses:
        return jsonify({"data": group_expenses}), 200
    
    else:
        return jsonify({"message": "Cannot find any expenses in this group", "data": []}), 500