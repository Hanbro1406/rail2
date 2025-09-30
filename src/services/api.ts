import { User, Train, Booking, SearchParams, BookingRequest, Station } from '../types';

// Mock data for demonstration
const mockStations: Station[] = [
  { station_id: 1, station_name: 'New Delhi', station_code: 'NDLS' },
  { station_id: 2, station_name: 'Mumbai Central', station_code: 'MMCT' },
  { station_id: 3, station_name: 'Chennai Central', station_code: 'MAS' },
  { station_id: 4, station_name: 'Kolkata', station_code: 'KOAA' },
  { station_id: 5, station_name: 'Bangalore', station_code: 'SBC' },
  { station_id: 6, station_name: 'Hyderabad', station_code: 'SC' },
  { station_id: 7, station_name: 'Pune', station_code: 'PUNE' },
  { station_id: 8, station_name: 'Ahmedabad', station_code: 'ADI' },
];

const mockTrains: Train[] = [
  {
    train_id: 1,
    train_name: 'Rajdhani Express',
    source_station_id: 1,
    destination_station_id: 2,
    total_seats: 200,
    available_seats: 45,
    source_station: mockStations[0],
    destination_station: mockStations[1],
  },
  {
    train_id: 2,
    train_name: 'Shatabdi Express',
    source_station_id: 1,
    destination_station_id: 3,
    total_seats: 150,
    available_seats: 82,
    source_station: mockStations[0],
    destination_station: mockStations[2],
  },
  {
    train_id: 3,
    train_name: 'Duronto Express',
    source_station_id: 2,
    destination_station_id: 4,
    total_seats: 180,
    available_seats: 23,
    source_station: mockStations[1],
    destination_station: mockStations[3],
  },
];

let mockBookings: Booking[] = [
  {
    booking_id: 1,
    pnr_number: 'PNR123456',
    user_id: 1,
    train_id: 1,
    booking_date: '2025-01-15',
    travel_date: '2025-01-25',
    status: 'CONFIRMED',
    train: mockTrains[0],
    passengers: [
      { passenger_id: 1, passenger_name: 'John Doe', age: 30, gender: 'Male', seat_number: 1 },
      { passenger_id: 2, passenger_name: 'Jane Doe', age: 28, gender: 'Female', seat_number: 2 },
    ],
  },
];

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Authentication
  async signup(userData: { username: string; email: string; password: string }): Promise<{ message: string }> {
    await delay(1000);
    // Simulate success response
    return { message: 'User created successfully!' };
  },

  async login(credentials: { username: string; password: string }): Promise<User> {
    await delay(800);
    // Simulate successful login
    return {
      user_id: 1,
      username: credentials.username,
      email: 'user@example.com',
      phone_number: '+1234567890',
    };
  },

  // Station search
  async getStations(): Promise<Station[]> {
    await delay(300);
    return mockStations;
  },

  // Train search
  async searchTrains(params: SearchParams): Promise<Train[]> {
    await delay(1200);
    // Filter trains based on search params
    return mockTrains.filter(train => {
      const fromStation = mockStations.find(s => s.station_code === params.from);
      const toStation = mockStations.find(s => s.station_code === params.to);
      return (
        train.source_station_id === fromStation?.station_id &&
        train.destination_station_id === toStation?.station_id
      );
    });
  },

  // Booking
  async bookTicket(bookingData: BookingRequest): Promise<{ message: string; pnr_number: string }> {
    await delay(1500);
    const pnr = 'PNR' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    // Add to mock bookings
    const newBooking: Booking = {
      booking_id: mockBookings.length + 1,
      pnr_number: pnr,
      user_id: bookingData.user_id,
      train_id: bookingData.train_id,
      booking_date: new Date().toISOString().split('T')[0],
      travel_date: bookingData.travel_date,
      status: 'CONFIRMED',
      train: mockTrains.find(t => t.train_id === bookingData.train_id),
      passengers: bookingData.passengers.map((p, index) => ({
        ...p,
        passenger_id: index + 1,
        seat_number: index + 1,
      })),
    };
    
    mockBookings.push(newBooking);
    
    return { message: 'Booking successful!', pnr_number: pnr };
  },

  // Get user bookings
  async getUserBookings(userId: number): Promise<Booking[]> {
    await delay(800);
    return mockBookings.filter(booking => booking.user_id === userId);
  },

  // Cancel ticket
  async cancelTicket(pnrNumber: string, userId: number): Promise<{ message: string }> {
    await delay(1000);
    const bookingIndex = mockBookings.findIndex(
      b => b.pnr_number === pnrNumber && b.user_id === userId
    );
    
    if (bookingIndex !== -1) {
      mockBookings[bookingIndex].status = 'CANCELLED';
      return { message: `Ticket with PNR ${pnrNumber} has been cancelled.` };
    }
    
    throw new Error('Booking not found or unauthorized');
  },
};