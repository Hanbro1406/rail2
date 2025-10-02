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
    waiting_list: 12,
    source_station: mockStations[0],
    destination_station: mockStations[1],
    departure_time: '08:00',
    arrival_time: '20:30',
    duration: '12h 30m',
    train_type: 'Superfast',
    stops: [
      { station_id: 1, station_name: 'New Delhi', station_code: 'NDLS', arrival_time: '08:00', departure_time: '08:00', platform: '1' },
      { station_id: 9, station_name: 'Kanpur Central', station_code: 'CNB', arrival_time: '14:15', departure_time: '14:20', platform: '3', halt_duration: '5m' },
      { station_id: 2, station_name: 'Mumbai Central', station_code: 'MMCT', arrival_time: '20:30', departure_time: '20:30', platform: '2' },
    ],
  },
  {
    train_id: 2,
    train_name: 'Shatabdi Express',
    source_station_id: 1,
    destination_station_id: 3,
    total_seats: 150,
    available_seats: 82,
    waiting_list: 5,
    source_station: mockStations[0],
    destination_station: mockStations[2],
    departure_time: '06:00',
    arrival_time: '14:45',
    duration: '8h 45m',
    train_type: 'Express',
    stops: [
      { station_id: 1, station_name: 'New Delhi', station_code: 'NDLS', arrival_time: '06:00', departure_time: '06:00', platform: '4' },
      { station_id: 10, station_name: 'Agra Cantt', station_code: 'AGC', arrival_time: '08:30', departure_time: '08:35', platform: '2', halt_duration: '5m' },
      { station_id: 3, station_name: 'Chennai Central', station_code: 'MAS', arrival_time: '14:45', departure_time: '14:45', platform: '1' },
    ],
  },
  {
    train_id: 3,
    train_name: 'Duronto Express',
    source_station_id: 2,
    destination_station_id: 4,
    total_seats: 180,
    available_seats: 23,
    waiting_list: 45,
    source_station: mockStations[1],
    destination_station: mockStations[3],
    departure_time: '22:15',
    arrival_time: '08:30',
    duration: '10h 15m',
    train_type: 'Non-stop',
    stops: [
      { station_id: 2, station_name: 'Mumbai Central', station_code: 'MMCT', arrival_time: '22:15', departure_time: '22:15', platform: '5' },
      { station_id: 4, station_name: 'Kolkata', station_code: 'KOAA', arrival_time: '08:30', departure_time: '08:30', platform: '3' },
    ],
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
    total_amount: 1700,
    booking_class: 'AC 3-Tier',
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

  // Get train details
  async getTrainDetails(trainId: number): Promise<Train | null> {
    await delay(500);
    return mockTrains.find(train => train.train_id === trainId) || null;
  },

  // Booking
  async bookTicket(bookingData: BookingRequest): Promise<{ message: string; pnr_number: string }> {
    await delay(1500);
    const pnr = 'PNR' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    // Pricing for different classes
    const classPricing = {
      'AC 1st Class': 2500,
      'AC 2-Tier': 1800,
      'AC 3-Tier': 1200,
      'Sleeper': 850,
      'General': 400,
    };
    
    const basePrice = classPricing[bookingData.booking_class as keyof typeof classPricing] || 850;
    
    // Determine booking status based on availability
    const train = mockTrains.find(t => t.train_id === bookingData.train_id);
    const status = train && train.available_seats && train.available_seats >= bookingData.passengers.length 
      ? 'CONFIRMED' 
      : 'WAITING';
    
    // Add to mock bookings
    const newBooking: Booking = {
      booking_id: mockBookings.length + 1,
      pnr_number: pnr,
      user_id: bookingData.user_id,
      train_id: bookingData.train_id,
      booking_date: new Date().toISOString().split('T')[0],
      travel_date: bookingData.travel_date,
      status: status,
      train: train,
      total_amount: bookingData.passengers.length * basePrice,
      booking_class: bookingData.booking_class || 'Sleeper',
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