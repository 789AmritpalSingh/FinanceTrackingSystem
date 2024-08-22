import mysql.connector
from mysql.connector import Error
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# Database configuration
DB_HOST = 'localhost'
DB_USER = 'root'
DB_PASSWORD = 'Amrit@2002'
DB_NAME = 'financetrackingsystem'


def get_db_connection():
    """
        Establish and return a connection to the MySQL database.
    """
    try:
        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        return None


def create_user(username, password):
    """
        Insert a new user account into the database.
        
        :param username: The username of the new user.
        :param password: The plaintext password of the new user.
        :return: True if the user was created successfully, False otherwise.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()
    try:
        # Storing passwords in the form of hash to the database, for the security reasons.
        password_hash = generate_password_hash(password)
        cursor.execute(
            "INSERT INTO users (username, password_hash) VALUES (%s, %s)",
            (username, password_hash)
        )
        connection.commit()
        return True
    except Exception as e:
        # Handle unique constraint (e.g., username already exists)
        print(f"Error during creating a user account - {e}")
        return False
    finally:
        cursor.close()
        connection.close()


def fetch_user(username):
    """
        Fetch a user's credentials from the database.
        
        :param username: The username of the user to fetch.
        :return: A dictionary with user data if found, None otherwise.
    """
    connection = get_db_connection()
    if connection is None:
        return None

    # The dictionary=True argument in the cursor() method is used to specify that the cursor should return results as
    # dictionaries, where the column names are used as keys.
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        return user
    except Exception as e:
        print(f"Error during fetching user info for username - {username} - {e}")
    finally:
        cursor.close()
        connection.close()


def update_user_password(username, new_password):
    """
        Update a user's password in the database.
        
        :param username: The username of the user to update.
        :param new_password: The new plaintext password to set.
        :return: True if the password was updated successfully, False otherwise.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()
    try:
        password_hash = generate_password_hash(new_password)
        cursor.execute(
            "UPDATE users SET password_hash = %s WHERE username = %s",
            (password_hash, username)
        )
        connection.commit()
        return True
    except mysql.connector.Error as e:
        print(f"Error updating password for username - {username}: {e}")
        return False
    finally:
        cursor.close()
        connection.close()


def update_user_last_login_datetime(username):
    """
        Update a user's last login time in the database.
        
        :param username: The username of the user for which to update the last login.
        :return: True if the user's last login was updated successfully, False otherwise.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()
    try:
        cursor.execute(
            "UPDATE users SET last_login = %s WHERE username = %s",
            (datetime.now(), username)
        )
        connection.commit()
        return True
    except mysql.connector.Error as e:
        print(f"Error updating user with username - {username} last login: {e}")
        return False
    finally:
        cursor.close()
        connection.close()


def add_user_individual_expense(username, amount, category, date, description):
    """
        :param username: The username of the user.
        :param amount: Amount of the expense added by the user.
        :param category: Category of the expense added.
        :param date: Expense spending date.
        :param description: Description of that particular expense.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()

    try:
        # Fetch the user's ID from the database based on the username
        cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
        result = cursor.fetchone()

        if result is None:
            return False

        user_id = result[0]  # Extract the user ID from the result tuple

        # Insert the expense associated with this user ID
        cursor.execute(
            "INSERT INTO user_personal_expenses (user_id, amount, category, date, description) "
            "VALUES (%s, %s, %s, %s, %s)", (user_id, amount, category, date, description)
        )
        connection.commit()
        return True
    except mysql.connector.Error as e:
        print(f"Error adding user individual expense: {e}")
        return False
    finally:
        cursor.close()
        connection.close()


def get_user_individual_expenses(username, start_date=None, end_date=None, category=None):
    """
        Fetch user expenses from the database with optional filtering.
        
        :param username: The username of the user.
        :param start_date: Filter expenses from this date onward.
        :param end_date: Filter expenses up to this date.
        :param category: Filter expenses by this category.
        :return: A list of expenses if found, otherwise an empty list.
    """
    connection = get_db_connection()
    if connection is None:
        return []

    cursor = connection.cursor(dictionary=True)
    query = "SELECT * FROM user_personal_expenses WHERE user_id = (SELECT id FROM users WHERE username = %s)"
    params = [username]

    if start_date:
        query += " AND date >= %s"
        params.append(start_date)

    if end_date:
        query += " AND date <= %s"
        params.append(end_date)

    if category:
        query += " AND category = %s"
        params.append(category)

    try:
        cursor.execute(query, params)
        expenses = cursor.fetchall()
        return expenses
    except mysql.connector.Error as e:
        print(f"Error fetching user individual expenses: {e}")
        return []
    finally:
        cursor.close()
        connection.close()


def get_user_id_from_username_in_users_table(username):
    """
        Function to retrieve the user id from the username provided in the users table
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()

    query = "SELECT id FROM users WHERE username = %s"

    try:
        cursor.execute(query, (username,))
        user_id = cursor.fetchone()
        return user_id

    except mysql.connector.Error as e:
        print(f"Error fetching user id from users table using username: {e}")
        return False
    finally:
        cursor.close()
        connection.close()


def get_expense_details_by_expense_id_and_user_id_from_user_personal_expenses_table(expense_id, user_id):
    """
        Function for fetching particular expense details using expense id and the user id.
        :param expense_id: ID of the expense added by the user.
        :param user_id: Id of the user in users table.
        :return: dictionary containing expense_details like amount, food, date, user id.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor(dictionary=True)
    query = "SELECT * FROM user_personal_expenses WHERE id = %s AND user_id = %s"

    try:
        cursor.execute(query, (expense_id, user_id))
        expense_details = cursor.fetchone()
        return expense_details

    except mysql.connector.Error as e:
        print(f"Error fetching expense details from user_personal_expenses table using expense id and user id: {e}")
        return False
    finally:
        cursor.close()
        connection.close()


def delete_user_personal_expense_using_expense_id(expense_id):
    """
        Function to delete user personal expense details using expense id in user_personal_expenses table.

        :param expense_id: ID of the expense added by the user.
        :return: True if the user's personal expense for the given expense id was deleted successfully, False otherwise.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()
    try:
        cursor.execute(
            "DELETE FROM user_personal_expenses WHERE expense_id = %s", (expense_id,)
        )
        connection.commit()
        return True
    except mysql.connector.Error as e:
        print(f"Error delete expense for the expense id - {expense_id}: {e}")
        return False
    finally:
        cursor.close()
        connection.close()


def update_user_expenses_in_user_personal_expenses_table(expense_id, data):
    """
        Function to update a user's expense in the database.
        :param expense_id: ID of the expense to update.
        :param data: A dictionary containing the updated fields (e.g., amount, category, date, description).
        :return: True if the update was successful, False otherwise.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()

    # Prepare the update statement based on the fields provided in the data dictionary
    update_fields = []
    update_values = []

    if 'amount' in data:
        update_fields.append("amount = %s")
        update_values.append(data['amount'])

    if 'category' in data:
        update_fields.append("category = %s")
        update_values.append(data['category'])

    if 'date' in data:
        update_fields.append("date = %s")
        update_values.append(data['date'])

    if 'description' in data:
        update_fields.append("description = %s")
        update_values.append(data['description'])

    # Ensure there are fields to update
    if not update_fields:
        return False

    # Construct the SQL query
    update_query = f"UPDATE user_personal_expenses SET {', '.join(update_fields)} WHERE expense_id = %s"

    try:
        cursor.execute(update_query, tuple(update_values))
        connection.commit()
        return cursor.rowcount > 0  # Return true if any rows were updated

    except mysql.connector.Error as e:
        print(f"Error updating expense with id {expense_id}: {e}")
        return False
    finally:
        cursor.close()
        connection.close()

