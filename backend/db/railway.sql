-- Create the Stations Table
-- This table holds all station information [cite: 37]
CREATE TABLE Stations (
    station_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each station [cite: 40]
    station_name VARCHAR(255) NOT NULL,       -- e.g., "New Delhi" [cite: 42]
    station_code VARCHAR(10) NOT NULL UNIQUE    -- e.g., "NDLS" [cite: 42]
);

-- Create the Users Table
-- This table stores user login details [cite: 27]
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,     -- Unique ID for each user [cite: 30]
    username VARCHAR(100) NOT NULL UNIQUE,      -- User's chosen name [cite: 31]
    password VARCHAR(255) NOT NULL,           -- Hashed password for security [cite: 31]
    email VARCHAR(255) NOT NULL UNIQUE,         -- User's email address [cite: 31]
    phone_number VARCHAR(15)                      -- User's phone number [cite: 31]
);

-- Create the Trains Table
-- This table contains details for each train [cite: 32]
CREATE TABLE Trains (
    train_id INT PRIMARY KEY AUTO_INCREMENT,     -- Unique ID for each train [cite: 33]
    train_name VARCHAR(255) NOT NULL,          -- e.g., "Shatabdi Express"
    source_station_id INT,                     -- Starting station ID [cite: 34]
    destination_station_id INT,                -- Ending station ID [cite: 35]
    total_seats INT NOT NULL,                  -- Total number of seats on the train [cite: 36]
    FOREIGN KEY (source_station_id) REFERENCES Stations(station_id), -- Links to Stations table [cite: 52]
    FOREIGN KEY (destination_station_id) REFERENCES Stations(station_id) -- Links to Stations table [cite: 52]
);

-- Create the Bookings Table
-- Stores high-level information about each booking [cite: 43]
CREATE TABLE Bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,   -- Unique ID for the booking [cite: 44]
    pnr_number VARCHAR(20) NOT NULL UNIQUE,      -- Unique PNR for the booking [cite: 45]
    user_id INT,                               -- Which user made the booking [cite: 45]
    train_id INT,                              -- Which train was booked [cite: 45]
    booking_date DATE NOT NULL,                -- Date the booking was made [cite: 46]
    travel_date DATE NOT NULL,                 -- Date of travel [cite: 46]
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED', -- "CONFIRMED" or "CANCELLED" [cite: 46]
    FOREIGN KEY (user_id) REFERENCES Users(user_id), -- Links to Users table [cite: 52]
    FOREIGN KEY (train_id) REFERENCES Trains(train_id) -- Links to Trains table [cite: 52]
);

-- Create the Passengers Table
-- Stores details for each passenger tied to a booking [cite: 47]
CREATE TABLE Passengers (
    passenger_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for a passenger entry [cite: 48]
    booking_id INT,                            -- Which booking this passenger belongs to [cite: 49]
    passenger_name VARCHAR(255) NOT NULL,      -- Passenger's name [cite: 50]
    age INT NOT NULL,                          -- Passenger's age [cite: 50]
    gender VARCHAR(10) NOT NULL,               -- Passenger's gender [cite: 50]
    seat_number INT,                           -- Assigned seat number [cite: 50]
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id) -- Links to Bookings table [cite: 52]
);