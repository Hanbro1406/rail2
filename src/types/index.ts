export interface User {
  user_id: number;
  username: string;
  email: string;
  phone_number?: string;
}

export interface Station {
  station_id: number;
  station_name: string;
  station_code: string;
}

export interface Train {
  train_id: number;
  train_name: string;
  source_station_id: number;
  destination_station_id: number;
  total_seats: number;
  available_seats?: number;
  waiting_list?: number;
  source_station?: Station;
  destination_station?: Station;
  departure_time?: string;
  arrival_time?: string;
  duration?: string;
  train_type?: string;
  stops?: TrainStop[];
}

export interface TrainStop {
  station_id: number;
  station_name: string;
  station_code: string;
  arrival_time: string;
  departure_time: string;
  platform?: string;
  halt_duration?: string;
}

export interface Passenger {
  passenger_name: string;
  age: number;
  gender: string;
}

export interface Booking {
  booking_id: number;
  pnr_number: string;
  user_id: number;
  train_id: number;
  booking_date: string;
  travel_date: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'WAITING';
  train?: Train;
  passengers?: PassengerWithSeat[];
  total_amount?: number;
  booking_class?: string;
}

export interface PassengerWithSeat extends Passenger {
  passenger_id: number;
  seat_number: number;
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
}

export interface BookingRequest {
  user_id: number;
  train_id: number;
  travel_date: string;
  passengers: Passenger[];
  booking_class?: string;
}