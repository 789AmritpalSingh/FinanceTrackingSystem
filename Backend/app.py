from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager
from user_authentication import UserRegistration, UserLogin, ProtectedResource
from personal_expenses import add_individual_expense, get_user_expenses, delete_user_expenses, update_user_expense
from group_expense import create_new_group, get_name_of_creator_of_the_group
from config import JWT_SECRET_KEY

app = Flask(__name__)

# This generates a secure random hexadecimal string of 64 characters (since 32 bytes = 64 hex characters).
app.config['JWT_SECRET_KEY'] =  JWT_SECRET_KEY

api = Api(app)
jwt = JWTManager(app)

# Adding resource endpoints to the API
api.add_resource(UserRegistration, '/register')
api.add_resource(UserLogin, '/login')
api.add_resource(ProtectedResource, '/protected')

# Personal Expense-related routes
app.add_url_rule('/add_individual_expense', 'add_individual_expense', add_individual_expense, methods=['POST'])
app.add_url_rule('/get_user_expenses', 'get_user_expenses', get_user_expenses, methods=['GET'])
app.add_url_rule('/delete_expense/<int:expense_id>', 'delete_user_expenses', delete_user_expenses, methods=['DELETE'])
app.add_url_rule('/update_expense/<int:expense_id>', 'update_user_expense', update_user_expense, methods=['PUT'])

# Group expense-related routes
app.add_url_rule('/create_group', 'create_new_group', create_new_group, methods=['POST'])
app.add_url_rule('/get_creator_name_of_the_group', 'get_creater_name', get_name_of_creator_of_the_group, methods=['GET'])

if __name__ == '__main__':
    app.run(debug=True)
