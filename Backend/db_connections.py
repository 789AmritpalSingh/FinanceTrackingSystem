import mysql.connector
from mysql.connector import Error
from werkzeug.security import generate_password_hash
from datetime import datetime

# Database configuration
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "Amrit@2002"
DB_NAME = "financetrackingsystem"


def get_db_connection():
    """
    Establish and return a connection to the MySQL database.
    """
    try:
        connection = mysql.connector.connect(
            host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        return None


def create_user(email, username, password):
    """
    Insert a new user account into the database.

    :param email: Email of the user.
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
            "INSERT INTO users (email, username, password_hash) VALUES (%s, %s, %s)",
            (email, username, password_hash),
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


def fetch_user_details(username):
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
        return None
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
            "UPDATE users SET password_hash = %s, account_credentials_last_updated_at = %s WHERE username = %s",
            (password_hash, datetime.now(), username),
        )
        connection.commit()
        return True
    except mysql.connector.Error as e:
        print(f"Error updating password for username - {username}: {e}")
        return False
    finally:
        cursor.close()
        connection.close()


def update_user_as_logged_in(username):
    """
    Update a user's as logged in, in the database.

    :param username: The username of the user for which to update the login.
    :return: True if the user's login was updated successfully, False otherwise.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()
    try:
        cursor.execute(
            "UPDATE users SET last_login = %s, is_logged_in = %s WHERE username = %s",
            (datetime.now(), 0, username),
        )
        connection.commit()
        return cursor.rowcount > 0
    except mysql.connector.Error as e:
        print(f"Error updating user with username - {username} login: {e}")
        return False
    finally:
        cursor.close()
        connection.close()


def update_user_as_logged_out(username):
    """
    Updating the user information as logged out in the database.

    :param username: The username of the user for which to update the log out details.
    :return: True if the user's logout was updated successfully, False otherwise.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()
    try:
        cursor.execute(
            "UPDATE users SET last_logged_out = %s, is_logged_in = %s WHERE username = %s",
            (datetime.now(), 1, username),
        )
        connection.commit()
        return cursor.rowcount > 0
    except mysql.connector.Error as e:
        print(f"Error updating user with username - {username} logout: {e}")
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
            "VALUES (%s, %s, %s, %s, %s)",
            (user_id, amount, category, date, description),
        )
        connection.commit()

        # Get the ID of the newly added expense
        expense_id = cursor.lastrowid

        return expense_id  # Return the new expense ID to the calling function

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
    query = """
               SELECT id, user_id, amount, category, DATE_FORMAT(date, '%Y-%m-%d') as date, description
               FROM user_personal_expenses 
               WHERE user_id = (SELECT id FROM users WHERE username = %s)
            """
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
        return None
    finally:
        cursor.close()
        connection.close()


def get_username_from_user_id_in_users_table(user_id):
    """
    Function to retrieve the username from the user_id provided in the users table
    :param user_id: Id of the user.
    :return: Name of the user.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()

    query = "SELECT username FROM users WHERE id = %s"

    try:
        cursor.execute(query, (user_id,))
        username = cursor.fetchone()
        return username

    except mysql.connector.Error as e:
        print(f"Error fetching username from users table using user_id: {e}")
        return None
    finally:
        cursor.close()
        connection.close()


def get_expense_details_by_expense_id_and_user_id_from_user_personal_expenses_table(
    expense_id, user_id
):
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
        print(
            f"Error fetching expense details from user_personal_expenses table using expense id and user id: {e}"
        )
        return None
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
            "DELETE FROM user_personal_expenses WHERE id = %s", (expense_id,)
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

    if "amount" in data:
        update_fields.append("amount = %s")
        update_values.append(data["amount"])

    if "category" in data:
        update_fields.append("category = %s")
        update_values.append(data["category"])

    if "date" in data:
        update_fields.append("date = %s")
        update_values.append(data["date"])

    if "description" in data:
        update_fields.append("description = %s")
        update_values.append(data["description"])

    # Ensure there are fields to update
    if not update_fields:
        return False

    # Append the expense_id to the update_values for the WHERE clause
    update_values.append(expense_id)

    # Construct the SQL query
    update_query = (
        f"UPDATE user_personal_expenses SET {', '.join(update_fields)} WHERE id = %s"
    )

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


# ----------------------------- Group feature endpoints -----------------------

# ----------------------- Groups table crud operations -----------------


def add_new_group_to_groups_table(group_name, creator_user_id):
    """
    Insert a new group details into the groups table.

    :param group_name: The name of the group.
    :param creator_user_id: The id of the user who created the group.
    :return: True if the group was created successfully, False otherwise.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()
    print(f"Creater user id - {creator_user_id} and group name - {group_name}")
    try:

        # groups is a reserved keyword in mysql, so need to use quotes for it.
        query = "INSERT INTO `groups` (group_name, creator_user_id) VALUES (%s, %s)"
        params = (group_name, creator_user_id)
        cursor.execute(query, params)
        connection.commit()
        return True

    except Exception as e:
        print(f"Error during adding a new group details to the groups table - {e}")
        return False
    finally:
        cursor.close()
        connection.close()


def get_group_name_from_group_id_in_group_table(group_id):
    """
    This function fetches the group name from the group id provided.
    :param group_id: The id of the group.
    :return: Name of the group.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor(dictionary=True)

    try:
        query = """
                    SELECT group_name 
                    FROM `groups`
                    WHERE id = %s
                """
        cursor.execute(query, (group_id,))
        group = cursor.fetchone()

        if group:
            return group["group_name"]
        else:
            print(f"No group found with id {group_id}")
            return None

    except mysql.connector.Error as e:
        print(f"Error fetching group name for group id {group_id}: {e}")
        return None

    finally:
        cursor.close()
        connection.close()


def get_group_id_from_group_name_in_group_table(group_name):
    """
    This function fetches the group id from the group name provided.
    :param group_name: The name of the group.
    :return: ID of the group.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor(dictionary=True)

    try:
        query = """
                    SELECT id
                    FROM `groups`
                    WHERE group_name = %s
                """
        cursor.execute(query, (group_name,))
        group_id = cursor.fetchone()

        if group_id:
            return group_id["id"]
        else:
            print(f"No group id found with name {group_name}")
            return None

    except mysql.connector.Error as e:
        print(f"Error fetching group id for group name {group_name}: {e}")
        return None

    finally:
        cursor.close()
        connection.close()


def get_group_id_from_group_name_and_creator_user_id_in_group_table(
    group_name, creator_user_id
):
    """
    This function fetches the group id from the group name and creator user id provided.
    :param group_name: The name of the group.
    :creator_user_id: ID of the creator of the group.
    :return: ID of the group.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor(dictionary=True)

    try:
        query = """
                    SELECT id
                    FROM `groups`
                    WHERE group_name = %s
                    AND creator_user_id = %s
                """
        cursor.execute(query, (group_name, creator_user_id))
        group_id = cursor.fetchone()

        if group_id:
            return group_id["id"]
        else:
            print(
                f"No group id found with name {group_name} and creator user id - {creator_user_id}"
            )
            return None

    except mysql.connector.Error as e:
        print(
            f"Error fetching group id for group name {group_name} and creator user id - {creator_user_id}: {e}"
        )
        return None

    finally:
        cursor.close()
        connection.close()


def get_group_name_from_creator_user_id_in_group_table(creator_user_id):
    """
    This function fetches the group name from the creator user id provided in groups table.
    :param creator_user_id: ID of the creator of the group.
    :return: Name of the group.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()

    try:
        query = """
                    SELECT group_name
                    FROM `groups`
                    WHERE creator_user_id = %s
                """
        cursor.execute(query, (creator_user_id,))
        group_names = cursor.fetchall()

        if group_names:
            return [
                group_name[0] for group_name in group_names
            ]  # Return list of group names
        else:
            print(f"No group found with creator id - {creator_user_id}")
            return None

    except mysql.connector.Error as e:
        print(f"Error fetching group name for creator user id - {creator_user_id}: {e}")
        return None

    finally:
        cursor.close()
        connection.close()


def get_creator_user_id_from_group_name_in_group_table(group_name):
    """
    This function fetches the creator user id from the group name provided.
    :param group_name: The name of the group.
    :return: User id of the creator.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor(dictionary=True)

    try:
        query = """
                    SELECT creator_user_id
                    FROM `groups`
                    WHERE group_name = %s
                """
        cursor.execute(query, (group_name,))
        creator_user_id = cursor.fetchone()

        if creator_user_id:
            return creator_user_id["creator_user_id"]
        else:
            print(f"No creator user id found with name {group_name}")
            return None

    except mysql.connector.Error as e:
        print(f"Error fetching creator user id for group name {group_name}: {e}")
        return None

    finally:
        cursor.close()
        connection.close()


def update_group_name_in_groups_table_using_group_id(group_id, new_group_name):
    """
    This function is for updating the group name using the group id and new group name provided.
    :param group_id: Id of the group to update name of.
    :param new_group_name: New name of the group to set.
    :return: True if the name was updated successfully else False.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()

    try:
        query = """
                    UPDATE `groups` SET group_name = %s WHERE id = %s
                """

        cursor.execute(query, (new_group_name, group_id))
        connection.commit()

        return (
            cursor.rowcount > 0
        )  # Return true if any of the row updated, false otherwise

    except mysql.connector.Error as e:
        print(f"Error updating group name for group_id {group_id}: {e}")
        return False

    finally:
        cursor.close()
        connection.close()


def delete_group_from_groups_table_using_group_id(group_id):
    """
    This function deletes the group details using the group id provided.
    :param group_id: Id of the group.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()

    try:
        query = """
                    DELETE FROM `groups` WHERE id = %s
                """

        cursor.execute(query, (group_id,))
        connection.commit()  # Ensure the changes are committed
        return (
            cursor.rowcount > 0
        )  # Return true if any of the row updated, false otherwise

    except mysql.connector.Error as e:
        print(f"Error deleting group for group_id {group_id}: {e}")
        return False

    finally:
        cursor.close()
        connection.close()


# ------------------- Group Members table crud operations ----------------------


def add_new_member_to_group_members_table(group_id, user_id):
    """
    Insert a new member into the group_members table.

    :param group_id: The id of the group.
    :param user_id: The id of the user who is getting added to the group.
    :return: True if the member was added successfully, False otherwise.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()
    try:

        query = "INSERT INTO group_members (group_id, user_id) VALUES (%s, %s)"
        params = (group_id, user_id)
        cursor.execute(query, params)
        connection.commit()
        return True

    except Exception as e:
        print(f"Error during adding a new member to the group_members table - {e}")
        return False
    finally:
        cursor.close()
        connection.close()


def get_group_names_for_user(user_id):
    """
    This function fetches all the group names in which a particular user is in using its id from groups table.
    :param user_id: The id of the user.
    :return: A list of group names the user is a part of.
    """
    connection = get_db_connection()
    if connection is None:
        return []

    cursor = connection.cursor(dictionary=True)

    try:
        query = """
                    SELECT g.group_name
                    FROM `groups` g
                    JOIN group_members gm ON g.id = gm.group_id
                    WHERE gm.user_id = %s 
                """
        cursor.execute(query, (user_id,))
        group_names = cursor.fetchall()

        return [group_name["group_name"] for group_name in group_names]

    except mysql.connector.Error as e:
        print(f"Error fetching group names for user_id {user_id}: {e}")
        return []

    finally:
        cursor.close()
        connection.close()


def get_all_user_id_using_group_id_in_group_members_table(group_id):
    """
    This function fetches all the user id from the group members table using group id provided
    for getting the list of all the users in a groups.
    :param group_id: Id of the group.
    :return user_id: Id of the user.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()
    try:
        query = """
                    SELECT user_id 
                    FROM 
                    group_members 
                    WHERE 
                    group_id = %s
                """

        cursor.execute(query, (group_id,))

        user_ids = cursor.fetchall()
        return [user_id[0] for user_id in user_ids]

    except mysql.connector.Error as e:
        print(f"Error fetching user_id for group id {group_id}: {e}")
        return []

    finally:
        cursor.close()
        connection.close()


def delete_user_from_group_members_table(user_id, group_id):
    """
    This function is for removing particular user from the group members table using its id.
    :param user_id: Id of the user.
    :param group_id: Id of the group.
    :return: True if the user deleted successfully False otherwise
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()

    try:
        query = """
                    DELETE FROM group_members WHERE user_id = %s AND group_id = %s
                """

        cursor.execute(query, (user_id, group_id))
        connection.commit()
        return cursor.rowcount > 0  # returns true if any of the rows were affected

    except mysql.connector.Error as e:
        print(
            f"Error deleting user from the group for the user_id {user_id} and group id -  {group_id}: {e}"
        )
        return False

    finally:
        cursor.close()
        connection.close()


# --------------------- Group expenses table CRUD operations ----------------------


def add_expense_to_group_expenses_table(group_id, expense_name, amount, paid_by):
    """
    Insert a new expense details into the group_expenses table.

    :param group_id: The id of the group.
    :param expense_name: The name of the expense getting added.
    :param amount: Amount of the expense paid by the person.
    :param paid_by: Id of the user who paid the expense.
    :param date: Date of adding expense to the group.
    :return: True if the expense was added successfully, False otherwise.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()
    try:

        query = "INSERT INTO group_expenses (group_id, expense_name, amount, paid_by, date) VALUES (%s, %s, %s, %s, %s)"
        params = (group_id, expense_name, amount, paid_by, datetime.now())
        cursor.execute(query, params)
        connection.commit()
        return True

    except Exception as e:
        print(f"Error during adding a new expense to the group_expenses table - {e}")
        return False
    finally:
        cursor.close()
        connection.close()


def get_all_expenses_details_for_a_particular_group_from_group_expenses_table(group_id):
    """
    Retrieves all the expenses detailed related to a group from group_expenses table.
    :param group_id: Id of the group passed for getting its related expenses.
    :return : details of all the expenses in a group.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor(dictionary=True)

    query = "SELECT * FROM group_expenses WHERE group_id = %s"

    try:
        cursor.execute(query, (group_id,))
        user_id = cursor.fetchall()
        return user_id

    except mysql.connector.Error as e:
        print(
            f"Error fetching expense details from group_expenses table using group id : {group_id}: {e}"
        )
        return None
    finally:
        cursor.close()
        connection.close()


def get_all_expenses_details_for_a_particular_group_paid_by_particular_user_from_group_expenses_table(
    group_id, paid_by
):
    """
    Retrieves all the expenses detailed related to a user in a particular group from group_expenses table using
    group_id and paid_by i.e. user_id.
    :param group_id: Id of the group passed for getting its related expenses.
    :param paid_by: Id of the user who paid the expense in the group.
    :return : details of all the expenses in a group paid by a particular user.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor(dictionary=True)

    query = "SELECT * FROM group_expenses WHERE group_id = %s and paid_by = %s"

    try:
        cursor.execute(query, (group_id, paid_by))
        user_id = cursor.fetchall()
        return user_id

    except mysql.connector.Error as e:
        print(
            f"Error fetching expense details from group_expenses table using group id - {group_id} and user_id - {user_id} : {e}"
        )
        return None
    finally:
        cursor.close()
        connection.close()


def update_expense_details_for_a_particular_expense_using_the_expense_id(
    expense_id, data
):
    """
    Function to update a group's expense in the group_expenses table.

    :param expense_id: The ID of the expense to update.
    :param data: A dictionary containing the updated fields (e.g., amount, expense_name, date, paid_by).
    :return: True if the update was successful, False otherwise.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()

    # Prepare the update statement based on the fields provided in the data dictionary
    update_fields = []
    update_values = []

    if "amount" in data:
        update_fields.append("amount = %s")
        update_values.append(data["amount"])

    if "expense_name" in data:
        update_fields.append("expense_name = %s")
        update_values.append(data["expense_name"])

    if "date" in data:
        update_fields.append("date = %s")
        update_values.append(data["date"])

    if "paid_by" in data:
        update_fields.append("paid_by = %s")
        update_values.append(data["paid_by"])

    # Ensure there are fields to update
    if not update_fields:
        return False

    # Construct the SQL query
    update_query = f"UPDATE group_expenses SET {', '.join(update_fields)} WHERE id = %s"
    update_values.append(expense_id)  # Add expense_id to the parameters

    try:
        cursor.execute(update_query, tuple(update_values))
        connection.commit()
        return cursor.rowcount > 0  # Return true if any rows were updated

    except mysql.connector.Error as e:
        print(f"Error updating group expense with id {expense_id}: {e}")
        return False
    finally:
        cursor.close()
        connection.close()


def delete_expense_from_group_expenses_table_using_expense_id(expense_id):
    """
    This function removes a particular expense details for the expense id provided.
    :param expense_id: ID of the expense to delete.
    :return: True if the expense was deleted successfully.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()

    try:
        query = """
                    DELETE FROM group_expenses WHERE id = %s
                """

        cursor.execute(query, (expense_id,))
        return True

    except mysql.connector.Error as e:
        print(
            f"Error deleting expense from the group expenses table using the expense id {expense_id}: {e}"
        )
        return False

    finally:
        cursor.close()
        connection.close()


def add_expense_shares(expense_id, user_shares):
    """
    This function is for adding the expense shares between the users in the expense_shares table.
    :param expense_id: ID of the expense.
    :param user_shares: A dictionary where keys are user_ids and the values are the share amount for each user.
    :return: True if shares were added successfully, False otherwise.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()

    try:
        for user_id, share_amount in user_shares.items():
            # Determine if the user owes or is owed based on the share amount.
            direction = "owes" if share_amount > 0 else "is_owed"
            status = "pending"
            settled = False
            settled_date = None

            query = """
                        INSERT INTO expense_shares (expense_id, user_id, share_amount, status, direction, settled, settled_date) VALUES (%s, %s, %s, %s, %s, %s)
                    """

            cursor.execute(
                query,
                (
                    expense_id,
                    user_id,
                    abs(share_amount),
                    status,
                    direction,
                    settled,
                    settled_date,
                ),
            )

            connection.commit()
            return True

    except mysql.connector.Error as e:
        print(f"Error adding expense shares in expense_shares table: {e}")
        connection.rollback()
        return False
    finally:
        cursor.close()
        connection.close()


def get_expense_shares_from_expense_shares_using_expense_id(expense_id):
    """
    This function retrieves expense shares for a specific expense using the expense_id.

    :param expense_id: ID of the expense in the expense_shares table.
    :return: A list of dictionaries containing share details or None if error occurs.
    """
    connection = get_db_connection()
    if connection is None:
        return None

    cursor = connection.cursor(dictionary=True)
    try:
        query = """
                    SELECT * FROM expense_shares
                    WHERE expense_id = %s
                """
        cursor.execute(query, (expense_id,))
        shares = cursor.fetchall()
        return shares

    except mysql.connector.Error as e:
        print(
            f"Error fetching expense shares from expense_shares table using expense_id - {expense_id}: {e}"
        )
        return None
    finally:
        cursor.close()
        connection.close()


def get_shares_for_user_from_expense_shares_table_using_user_id(user_id):
    """
    This function retrieves all shares for a specific user using the user_id provided.

    :param user_id: ID of the user.
    :return: A list of dictionaries containing share details or None if error occurs.
    """
    connection = get_db_connection()
    if connection is None:
        return None

    cursor = connection.cursor(dictionary=True)
    try:
        query = """
                    SELECT * FROM expense_shares
                    WHERE user_id = %s
                """
        cursor.execute(query, (user_id,))
        shares = cursor.fetchall()
        return shares

    except mysql.connector.Error as e:
        print(f"Error fetching shares for user id {user_id}: {e}")
        return None
    finally:
        cursor.close()
        connection.close()


def get_pending_shares_for_userfrom_expense_shares_table_using_user_id(user_id):
    """
    This function retrieves all pending shares for a specific user.

    :param user_id: ID of the user.
    :return: A list of dictionaries containing pending share details or None if error occurs.
    """
    connection = get_db_connection()
    if connection is None:
        return None

    cursor = connection.cursor(dictionary=True)
    try:
        query = """
                    SELECT * FROM expense_shares
                    WHERE user_id = %s AND status = 'pending'
                """
        cursor.execute(query, (user_id,))
        shares = cursor.fetchall()
        return shares

    except mysql.connector.Error as e:
        print(f"Error fetching pending shares for user id {user_id}: {e}")
        return None
    finally:
        cursor.close()
        connection.close()


def get_share_details_using_expense_id_and_user_id(expense_id, user_id):
    """
    This function retrieves share details for a specific expense and user.

    :param expense_id: ID of the expense.
    :param user_id: ID of the user.
    :return: Dictionary containing share details or None if error occurs.
    """
    connection = get_db_connection()
    if connection is None:
        return None

    cursor = connection.cursor(dictionary=True)
    try:
        query = """
                    SELECT * FROM expense_shares
                    WHERE expense_id = %s AND user_id = %s
                """
        cursor.execute(query, (expense_id, user_id))
        share_details = cursor.fetchone()
        return share_details

    except mysql.connector.Error as e:
        print(
            f"Error fetching share details for expense id {expense_id} and user id {user_id}: {e}"
        )
        return None
    finally:
        cursor.close()
        connection.close()


def update_expense_share_in_expense_shares_table_using_share_id(
    share_id,
    share_amount=None,
    status=None,
    direction=None,
    settled=None,
    settled_date=None,
):
    """
    This function updates a specific share details in the expense_shares table using the id of the share provided.
    :param share_id: ID of the share to update.
    :param share_amount: New share amount (optional).
    :param status: New status (optional).
    :param direction: New direction (optional).
    :param settled: New settled state (optional).
    :param settled_date: New settled date (optional).
    :return: True if the share was updated successfully,   False otherwise.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()
    updates = []
    values = []

    if share_amount is not None:
        updates.append("share_amount = %s")
        values.append(share_amount)

    if status is not None:
        updates.append("status = %s")
        values.append(status)

    if direction is not None:
        updates.append("direction = %s")
        values.append(direction)

    if settled is not None:
        updates.append("settled = %s")
        values.append(settled)

    if settled_date is not None:
        updates.append("settled_date = %s")
        values.append(settled_date)

    if not updates:
        return False

    values.append(share_id)
    update_query = f"UPDATE expense_shares SET {', '.join(updates)} WHERE id = %s"

    try:
        cursor.execute(update_query, tuple(values))
        connection.commit()
        return cursor.rowcount > 0  # Return true if any rows were updated

    except mysql.connector.Error as e:
        print(f"Error updating expense share with id {share_id}: {e}")
        connection.rollback()
        return False
    finally:
        cursor.close()
        connection.close()


def settle_all_shares_for_given_expense_id_in_expense_shares_table(expense_id):
    """
    This function settles all shares for a specific expense.

    :param expense_id: ID of the expense.
    :return: True if the shares were settled successfully, False otherwise.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()
    try:
        query = """
                    UPDATE expense_shares
                    SET settled = TRUE, settled_date = NOW()
                    WHERE expense_id = %s AND settled = FALSE
                """
        cursor.execute(query, (expense_id,))
        connection.commit()
        return cursor.rowcount > 0

    except mysql.connector.Error as e:
        print(f"Error settling shares for expense id {expense_id}: {e}")
        connection.rollback()
        return False
    finally:
        cursor.close()
        connection.close()


def delete_expense_share_from_expense_shares_table_using_share_id(share_id):
    """
    This function deletes a specific share from the expense_shares table using the share id provided.

    :param share_id: ID of the share to delete.
    :return: True if the share was deleted successfully, False otherwise.
    """
    connection = get_db_connection()
    if connection is None:
        return False

    cursor = connection.cursor()
    try:
        query = """
                    DELETE FROM expense_shares
                    WHERE id = %s
                """
        cursor.execute(query, (share_id,))
        connection.commit()
        return cursor.rowcount > 0  # Return true if any rows were deleted

    except mysql.connector.Error as e:
        print(f"Error deleting expense share with id {share_id}: {e}")
        connection.rollback()
        return False
    finally:
        cursor.close()
        connection.close()
