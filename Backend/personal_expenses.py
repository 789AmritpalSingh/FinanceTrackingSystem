from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import db_connections as db

@jwt_required()
def add_individual_expense():
    """
        Endpoint to add an individual expense for the authenticated user.
    """
    data = request.get_json()
    username = get_jwt_identity()
    amount = data.get('amount')
    category = data.get('category')
    date = data.get('date')
    description = data.get('description')

    if not all([amount, category, date]):
        return jsonify({"message": "Amount, category, and date are required fields."}), 400

    expense_id = db.add_user_individual_expense(username, amount, category, date, description)
    if expense_id:
        return jsonify({"message": "Expense added successfully!", "expense_id": expense_id}), 201
    else:
        return jsonify({"message": "Failed to add expense."}), 500


@jwt_required()
def get_user_expenses():
    """
        Endpoint to retrieve expenses for the authenticated user.
        Optional query parameters: start_date, end_date, category.
    """
    username = get_jwt_identity()

    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    category = request.args.get('category')

    expenses = db.get_user_individual_expenses(username, start_date, end_date, category)
    if not expenses:
        return jsonify({"message": "No expenses found.", "data": []}), 200
    
    print(f'Individual expenses - {expenses}')

    return jsonify({"data": expenses}), 200


@jwt_required()
def delete_user_expenses(expense_id):
    """
        This function is for deleting the existing expenses for the authenticated user.
    """
    username = get_jwt_identity()
    # Retrieve user id of user from users table using username
    user_id = None
    user_id_tuple_result = db.get_user_id_from_username_in_users_table(username)
    if user_id_tuple_result:
        user_id = user_id_tuple_result[0]

    else:
        print(f"Failed to get user id for the username - {username}")

    # Ensure the expenses belong to the user before deleting
    expense = db.get_expense_details_by_expense_id_and_user_id_from_user_personal_expenses_table(expense_id, user_id)
    # If expense not found for the given user or expense id
    if not expense:
        return jsonify({"message": "Expense not found or not authorized to delete."}), 404

    # Delete the expense
    result = db.delete_user_personal_expense_using_expense_id(expense_id)

    if result:
        return jsonify({"message": "Expense deleted successfully!"}), 200
    else:
        return jsonify({"message": "Failed to delete expense."}), 500


@jwt_required()
def update_user_expense(expense_id):
    """
        Function for updating the user existing expense.
    """
    data = request.get_json()
    username = get_jwt_identity()

    # Retrieve user id of user from users table using username
    user_id = None
    user_id_tuple_result = db.get_user_id_from_username_in_users_table(username)
    if user_id_tuple_result:
        user_id = user_id_tuple_result[0]

    else:
        print(f"Failed to get user id for the username - {username}")

    # Ensure the expense belong to the user before updating
    expense = db.get_expense_details_by_expense_id_and_user_id_from_user_personal_expenses_table(expense_id, user_id)
    # If expense not found for the given user or expense id
    if not expense:
        return jsonify({"message": "Expense not found or not authorized to update."}), 404

    # Update the expense with the new data
    result = db.update_user_expenses_in_user_personal_expenses_table(expense_id, data)
    if result:
        return jsonify({"message": "Expense updated successfully!"}), 200
    else:
        return jsonify({"message": "Failed to update expense."}), 500