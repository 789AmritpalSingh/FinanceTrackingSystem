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

    # The dictionary=True argument in the cursor() method is used to specify that the cursor should return results as dictionaries, where the column names are used as keys.
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

