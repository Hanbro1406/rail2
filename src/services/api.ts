import { User, Train, Booking, SearchParams, BookingRequest, Station } from '../types';
import { indianRailwayAPI, IRStation, IRTrain } from './railwayApi';

// Cache for stations and trains
let cachedStations: Station[] = [];
let cachedTrains: Train[] = [];

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
    await delay(500);
    
    if (cachedStations.length > 0) {
      return cachedStations;
    }

    try {
      const irStations = await indianRailwayAPI.getAllStations();
      cachedStations = irStations.map((station, index) => ({
        station_id: index + 1,
        station_name: station.station_name,
        station_code: station.station_code,
      }));
      return cachedStations;
    } catch (error) {
      console.error('Error fetching stations from API:', error);
      // Fallback to basic stations
      cachedStations = [
        { station_id: 1, station_name: 'New Delhi', station_code: 'NDLS' },
        { station_id: 2, station_name: 'Mumbai CST', station_code: 'CSMT' },
        { station_id: 3, station_name: 'Chennai Central', station_code: 'MAS' },
        { station_id: 4, station_name: 'Howrah Junction', station_code: 'HWH' },
        { station_id: 5, station_name: 'Bangalore City', station_code: 'SBC' },
        { station_id: 6, station_name: 'Secunderabad Junction', station_code: 'SC' },
        { station_id: 7, station_name: 'Pune Junction', station_code: 'PUNE' },
        { station_id: 8, station_name: 'Ahmedabad Junction', station_code: 'ADI' },
      ];
      return cachedStations;
    }
  },

  // Train search
  async searchTrains(params: SearchParams): Promise<Train[]> {
    await delay(1500);
    
    try {
      const irTrains = await indianRailwayAPI.searchTrains(params.from, params.to, params.date);
      const stations = await this.getStations();
      
      const trains: Train[] = irTrains.map((irTrain, index) => {
        const sourceStation = stations.find(s => s.station_code === irTrain.from_station_code);
        const destStation = stations.find(s => s.station_code === irTrain.to_station_code);
        
        // Generate realistic availability based on train type
        const totalSeats = this.getTotalSeats(irTrain.train_name);
        const availableSeats = Math.floor(Math.random() * totalSeats * 0.7) + 10;
        const waitingList = Math.floor(Math.random() * 50);
        
        return {
          train_id: parseInt(irTrain.train_number),
          train_name: irTrain.train_name,
          source_station_id: sourceStation?.station_id || 1,
          destination_station_id: destStation?.station_id || 2,
          total_seats: totalSeats,
          available_seats: availableSeats,
          waiting_list: waitingList,
          source_station: sourceStation,
          destination_station: destStation,
          departure_time: irTrain.departure_time,
          arrival_time: irTrain.arrival_time,
          duration: irTrain.travel_time,
          train_type: this.getTrainType(irTrain.train_name),
          stops: []
        };
      });
      
      return trains;
    } catch (error) {
      console.error('Error searching trains:', error);
      // Fallback to mock data
      return this.getMockTrains(params);
    }
  },

  // Get train details
  async getTrainDetails(trainId: number): Promise<Train | null> {
    await delay(800);
    
    try {
      const schedule = await indianRailwayAPI.getTrainSchedule(trainId.toString());
      const stations = await this.getStations();
      
      if (schedule) {
        const sourceStation = stations.find(s => s.station_code === schedule.stations[0]?.station_code);
        const destStation = stations.find(s => s.station_code === schedule.stations[schedule.stations.length - 1]?.station_code);
        
        const totalSeats = this.getTotalSeats(schedule.train_name);
        const availableSeats = Math.floor(Math.random() * totalSeats * 0.7) + 10;
        const waitingList = Math.floor(Math.random() * 50);
        
        return {
          train_id: trainId,
          train_name: schedule.train_name,
          source_station_id: sourceStation?.station_id || 1,
          destination_station_id: destStation?.station_id || 2,
          total_seats: totalSeats,
          available_seats: availableSeats,
          waiting_list: waitingList,
          source_station: sourceStation,
          destination_station: destStation,
          departure_time: schedule.stations[0]?.departure_time || '08:00',
          arrival_time: schedule.stations[schedule.stations.length - 1]?.arrival_time || '20:00',
          duration: this.calculateDuration(schedule.stations[0]?.departure_time, schedule.stations[schedule.stations.length - 1]?.arrival_time),
          train_type: this.getTrainType(schedule.train_name),
          stops: schedule.stations.map(station => ({
            station_id: stations.find(s => s.station_code === station.station_code)?.station_id || 1,
            station_name: station.station_name,
            station_code: station.station_code,
            arrival_time: station.arrival_time,
            departure_time: station.departure_time,
            platform: Math.floor(Math.random() * 6) + 1 + '',
            halt_duration: station.halt_time
          }))
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching train details:', error);
      return this.getMockTrainDetails(trainId);
    }
  },

  // Helper methods
  getTotalSeats(trainName: string): number {
    if (trainName.toLowerCase().includes('rajdhani')) return 300;
    if (trainName.toLowerCase().includes('shatabdi')) return 250;
    if (trainName.toLowerCase().includes('duronto')) return 280;
    if (trainName.toLowerCase().includes('express')) return 400;
    if (trainName.toLowerCase().includes('superfast')) return 350;
    return 200;
  },

  getTrainType(trainName: string): string {
    if (trainName.toLowerCase().includes('rajdhani')) return 'Rajdhani';
    if (trainName.toLowerCase().includes('shatabdi')) return 'Shatabdi';
    if (trainName.toLowerCase().includes('duronto')) return 'Duronto';
    if (trainName.toLowerCase().includes('superfast')) return 'Superfast';
    if (trainName.toLowerCase().includes('express')) return 'Express';
    return 'Passenger';
  },

  calculateDuration(departure: string, arrival: string): string {
    // Simple duration calculation - in real app, this would be more sophisticated
    return '12h 30m';
  },

  getMockTrains(params: SearchParams): Train[] {
    // Fallback mock data
    const mockTrains: Train[] = [
      {
        train_id: 12301,
        train_name: 'Howrah Rajdhani Express',
        source_station_id: 1,
        destination_station_id: 4,
        total_seats: 300,
        available_seats: 45,
        waiting_list: 12,
        source_station: { station_id: 1, station_name: 'New Delhi', station_code: 'NDLS' },
        destination_station: { station_id: 4, station_name: 'Howrah Junction', station_code: 'HWH' },
        departure_time: '16:55',
        arrival_time: '09:55+1',
        duration: '17h 00m',
        train_type: 'Rajdhani',
        stops: []
      },
      {
        train_id: 12002,
        train_name: 'New Delhi Shatabdi Express',
        source_station_id: 1,
        destination_station_id: 7,
        total_seats: 250,
        available_seats: 82,
        waiting_list: 5,
        source_station: { station_id: 1, station_name: 'New Delhi', station_code: 'NDLS' },
        destination_station: { station_id: 7, station_name: 'Pune Junction', station_code: 'PUNE' },
        departure_time: '06:00',
        arrival_time: '14:05',
        duration: '8h 05m',
        train_type: 'Shatabdi',
        stops: []
      }
    ];
    
    return mockTrains.filter(train => {
      const fromStation = cachedStations.find(s => s.station_code === params.from);
      const toStation = cachedStations.find(s => s.station_code === params.to);
      return (
        train.source_station_id === fromStation?.station_id &&
        train.destination_station_id === toStation?.station_id
      );
    });
  },

  getMockTrainDetails(trainId: number): Train | null {
    const mockTrains = this.getMockTrains({ from: 'NDLS', to: 'HWH', date: '' });
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