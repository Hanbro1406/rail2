# app.py
from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash # For hashing passwords
# You would also need to set up your database connection here

app = Flask(__name__)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data['username']
    email = data['email']
    # Hash the password before storing it
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

    # SQL to insert the new user into the Users table
    # db_cursor.execute("INSERT INTO Users (username, email, password) VALUES (%s, %s, %s)",
    #                   (username, email, hashed_password))
    # db_connection.commit()

    return jsonify({"message": "User created successfully!"}), 201

# app.py (continued)

@app.route('/search_trains', methods=['GET'])
def search_trains():
    # Get parameters from the request URL (e.g., /search_trains?from=STN1&to=STN2&date=2025-10-10)
    from_station_code = request.args.get('from')
    to_station_code = request.args.get('to')
    travel_date = request.args.get('date')

    # Here you would write SQL to:
    # 1. Get station_id for from_station_code and to_station_code from the Stations table.
    # 2. Find trains in the Trains table matching the source and destination IDs.
    # 3. For each train, calculate available seats.
    #    (total_seats - count of confirmed bookings for that train on that date)

    # Dummy data for demonstration
    available_trains = [
        {"train_id": 1, "train_name": "Capital Express", "available_seats": 120},
        {"train_id": 2, "train_name": "Intercity Special", "available_seats": 55}
    ]

    return jsonify(available_trains)

# app.py (continued)
import random
import string

def generate_pnr():
    # Generates a random 6-character PNR
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@app.route('/book_ticket', methods=['POST'])
def book_ticket():
    data = request.get_json() # Assumes a logged-in user's ID is available
    user_id = data['user_id']
    train_id = data['train_id']
    travel_date = data['travel_date']
    passengers = data['passengers'] # A list of passenger dicts [{name, age, gender}, ...]

    pnr = generate_pnr()
    
    # IMPORTANT: Use a database transaction here.
    # This ensures that if any step fails, all previous steps are rolled back.

    # 1. Create a new record in the Bookings table [cite: 59]
    #    db_cursor.execute("INSERT INTO Bookings (pnr_number, user_id, train_id, travel_date, ...)
    #                      VALUES (%s, %s, %s, %s, ...)", (pnr, user_id, train_id, travel_date))
    #    booking_id = db_cursor.lastrowid # Get the ID of the new booking

    # 2. Loop through passengers and add them to the Passengers table [cite: 59]
    #    for p in passengers:
    #        db_cursor.execute("INSERT INTO Passengers (booking_id, passenger_name, age, gender)
    #                          VALUES (%s, %s, %s, %s)", (booking_id, p['name'], p['age'], p['gender']))

    # 3. Commit the transaction
    #    db_connection.commit()

    return jsonify({"message": "Booking successful!", "pnr_number": pnr}), 200 # [cite: 60]

# app.py (continued)

@app.route('/cancel_ticket', methods=['POST'])
def cancel_ticket():
    data = request.get_json()
    pnr_number = data['pnr_number']
    user_id = data['user_id'] # To verify the user owns this ticket

    # SQL to update the booking status
    # db_cursor.execute("UPDATE Bookings SET status = 'CANCELLED'
    #                   WHERE pnr_number = %s AND user_id = %s", (pnr_number, user_id))
    # db_connection.commit()
    
    # You would also need to update seat availability logic to account for cancelled tickets.

    return jsonify({"message": f"Ticket with PNR {pnr_number} has been cancelled."})

# app.py
from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash
import mysql.connector # Import the connector

app = Flask(__name__)

# --- DATABASE CONNECTION SETUP ---
# Replace with your actual database credentials
db_config = {
    'host': 'localhost',
    'user': 'your_username',
    'password': 'your_password',
    'database': 'railway_reservation' # The database you created
}

def get_db_connection():
    """Establishes a connection to the database."""
    conn = mysql.connector.connect(**db_config)
    return conn

# --- EXAMPLE: REVISITING THE SIGNUP FUNCTION ---
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data['username']
    email = data['email']
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

    # Now, use the connection to execute SQL
    conn = get_db_connection()
    cursor = conn.cursor() # The cursor is used to execute commands

    try:
        # This SQL query actually runs on your database
        cursor.execute("INSERT INTO Users (username, email, password) VALUES (%s, %s, %s)",
                       (username, email, hashed_password))
        conn.commit() # Save the changes
        message = "User created successfully!"
        status_code = 201
    except mysql.connector.Error as err:
        # Handle potential errors, like a duplicate username
        message = f"Error: {err}"
        status_code = 400
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": message}), status_code