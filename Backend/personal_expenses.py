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

    result = db.add_user_individual_expense(username, amount, category, date, description)
    if result:
        return jsonify({"message": "Expense added successfully!"}), 201
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
        return jsonify({"message": "No expenses found."}), 404

    return jsonify(expenses), 200
