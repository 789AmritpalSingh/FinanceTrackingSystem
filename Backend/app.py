from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from user_authentication import UserRegistration, UserLogin, ProtectedResource
from personal_expenses import add_individual_expense, get_user_expenses, delete_user_expenses, update_user_expense
from group_expense import create_new_group, get_name_of_creator_of_the_group, update_group_name, delete_group, add_new_member_to_group, get_all_users_in_the_group, delete_member_from_group
from config import JWT_SECRET_KEY

app = Flask(__name__)

# This generates a secure random hexadecimal string of 64 characters (since 32 bytes = 64 hex characters).
app.config['JWT_SECRET_KEY'] =  JWT_SECRET_KEY

# Enable CORS for all routes
CORS(app)  # Add this line

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
app.add_url_rule('/update_group_name/<string:group_name>', 'update_name_of_group', update_group_name, methods=['PUT'])
app.add_url_rule('/delete_group/<string:group_name>', 'delete_group', delete_group, methods=['DELETE'])

app.add_url_rule('/add_new_member', 'add_new_member', add_new_member_to_group, methods=['POST'])
app.add_url_rule('/get_group_members', 'get_group_members', get_all_users_in_the_group, methods=['GET'])
app.add_url_rule('/delete_group_member/<string:member_username>/<string:group_name>', 
                 'delete_group_member', delete_member_from_group, methods=['DELETE'])

if __name__ == '__main__':
    app.run(debug=True)
