// Indian Railway API integration
const RAILWAY_API_BASE = 'https://indianrailapi.com/api/v2';
const API_KEY = 'your-api-key'; // You'll need to get this from indianrailapi.com

// Alternative free APIs
const IRCTC_API_BASE = 'https://www.irctc.co.in/eticketing/protected/mapps01';
const TRAINMAN_API = 'https://trainman.in/api';

// Types for Indian Railway API responses
export interface IRStation {
  station_code: string;
  station_name: string;
  state_code?: string;
  zone_code?: string;
}

export interface IRTrain {
  train_number: string;
  train_name: string;
  from_station_code: string;
  from_station_name: string;
  to_station_code: string;
  to_station_name: string;
  departure_time: string;
  arrival_time: string;
  travel_time: string;
  distance: string;
  classes: string[];
  days: string[];
}

export interface IRTrainSchedule {
  train_number: string;
  train_name: string;
  stations: {
    station_code: string;
    station_name: string;
    arrival_time: string;
    departure_time: string;
    halt_time: string;
    distance: string;
    day: number;
  }[];
}

export interface IRSeatAvailability {
  train_number: string;
  class_type: string;
  date: string;
  from_station: string;
  to_station: string;
  current_status: string;
  confirm_probability: string;
}

class IndianRailwayAPI {
  private apiKey: string;

  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
  }

  // Fetch all major railway stations
  async getAllStations(): Promise<IRStation[]> {
    try {
      // Using a comprehensive list of major Indian railway stations
      const majorStations: IRStation[] = [
        // Metro Cities
        { station_code: 'NDLS', station_name: 'New Delhi', state_code: 'DL', zone_code: 'NR' },
        { station_code: 'CSMT', station_name: 'Mumbai CST', state_code: 'MH', zone_code: 'CR' },
        { station_code: 'MAS', station_name: 'Chennai Central', state_code: 'TN', zone_code: 'SR' },
        { station_code: 'HWH', station_name: 'Howrah Junction', state_code: 'WB', zone_code: 'ER' },
        { station_code: 'SBC', station_name: 'Bangalore City', state_code: 'KA', zone_code: 'SWR' },
        { station_code: 'SC', station_name: 'Secunderabad Junction', state_code: 'TS', zone_code: 'SCR' },
        { station_code: 'PUNE', station_name: 'Pune Junction', state_code: 'MH', zone_code: 'CR' },
        { station_code: 'ADI', station_name: 'Ahmedabad Junction', state_code: 'GJ', zone_code: 'WR' },
        
        // North India
        { station_code: 'DLI', station_name: 'Delhi Junction', state_code: 'DL', zone_code: 'NR' },
        { station_code: 'ANVT', station_name: 'Anand Vihar Terminal', state_code: 'DL', zone_code: 'NR' },
        { station_code: 'NZM', station_name: 'Hazrat Nizamuddin', state_code: 'DL', zone_code: 'NR' },
        { station_code: 'CNB', station_name: 'Kanpur Central', state_code: 'UP', zone_code: 'NR' },
        { station_code: 'LKO', station_name: 'Lucknow Charbagh', state_code: 'UP', zone_code: 'NER' },
        { station_code: 'AGC', station_name: 'Agra Cantt', state_code: 'UP', zone_code: 'NCR' },
        { station_code: 'GWL', station_name: 'Gwalior Junction', state_code: 'MP', zone_code: 'NCR' },
        { station_code: 'JHS', station_name: 'Jhansi Junction', state_code: 'UP', zone_code: 'NCR' },
        { station_code: 'BPL', station_name: 'Bhopal Junction', state_code: 'MP', zone_code: 'WCR' },
        { station_code: 'JBP', station_name: 'Jabalpur Junction', state_code: 'MP', zone_code: 'WCR' },
        
        // West India
        { station_code: 'BCT', station_name: 'Mumbai Central', state_code: 'MH', zone_code: 'WR' },
        { station_code: 'LTT', station_name: 'Lokmanya Tilak Terminus', state_code: 'MH', zone_code: 'CR' },
        { station_code: 'BDTS', station_name: 'Bandra Terminus', state_code: 'MH', zone_code: 'WR' },
        { station_code: 'NGP', station_name: 'Nagpur Junction', state_code: 'MH', zone_code: 'CR' },
        { station_code: 'ST', station_name: 'Surat', state_code: 'GJ', zone_code: 'WR' },
        { station_code: 'BRC', station_name: 'Vadodara Junction', state_code: 'GJ', zone_code: 'WR' },
        { station_code: 'JP', station_name: 'Jaipur Junction', state_code: 'RJ', zone_code: 'NWR' },
        { station_code: 'JU', station_name: 'Jodhpur Junction', state_code: 'RJ', zone_code: 'NWR' },
        { station_code: 'UDZ', station_name: 'Udaipur City', state_code: 'RJ', zone_code: 'NWR' },
        
        // South India
        { station_code: 'KPD', station_name: 'Katpadi Junction', state_code: 'TN', zone_code: 'SR' },
        { station_code: 'MDU', station_name: 'Madurai Junction', state_code: 'TN', zone_code: 'SR' },
        { station_code: 'CBE', station_name: 'Coimbatore Junction', state_code: 'TN', zone_code: 'SR' },
        { station_code: 'TCR', station_name: 'Thrissur', state_code: 'KL', zone_code: 'SR' },
        { station_code: 'ERS', station_name: 'Ernakulam Junction', state_code: 'KL', zone_code: 'SR' },
        { station_code: 'TVC', station_name: 'Thiruvananthapuram Central', state_code: 'KL', zone_code: 'SR' },
        { station_code: 'MYS', station_name: 'Mysore Junction', state_code: 'KA', zone_code: 'SWR' },
        { station_code: 'UBL', station_name: 'Hubballi Junction', state_code: 'KA', zone_code: 'SWR' },
        { station_code: 'VSKP', station_name: 'Visakhapatnam Junction', state_code: 'AP', zone_code: 'ECoR' },
        { station_code: 'BZA', station_name: 'Vijayawada Junction', state_code: 'AP', zone_code: 'SCR' },
        
        // East India
        { station_code: 'KOAA', station_name: 'Kolkata', state_code: 'WB', zone_code: 'ER' },
        { station_code: 'SDAH', station_name: 'Sealdah', state_code: 'WB', zone_code: 'ER' },
        { station_code: 'ASN', station_name: 'Asansol Junction', state_code: 'WB', zone_code: 'ER' },
        { station_code: 'PURI', station_name: 'Puri', state_code: 'OR', zone_code: 'ECoR' },
        { station_code: 'BBS', station_name: 'Bhubaneswar', state_code: 'OR', zone_code: 'ECoR' },
        { station_code: 'TATA', station_name: 'Tatanagar Junction', state_code: 'JH', zone_code: 'SER' },
        { station_code: 'RNC', station_name: 'Ranchi Junction', state_code: 'JH', zone_code: 'SER' },
        { station_code: 'DHN', station_name: 'Dhanbad Junction', state_code: 'JH', zone_code: 'ECR' },
        
        // Northeast India
        { station_code: 'GHY', station_name: 'Guwahati', state_code: 'AS', zone_code: 'NFR' },
        { station_code: 'DBRG', station_name: 'Dibrugarh', state_code: 'AS', zone_code: 'NFR' },
        { station_code: 'AGTL', station_name: 'Agartala', state_code: 'TR', zone_code: 'NFR' },
        
        // Central India
        { station_code: 'ET', station_name: 'Itarsi Junction', state_code: 'MP', zone_code: 'WCR' },
        { station_code: 'BSP', station_name: 'Bilaspur Junction', state_code: 'CG', zone_code: 'SECR' },
        { station_code: 'R', station_name: 'Raipur Junction', state_code: 'CG', zone_code: 'SECR' },
        
        // Hill Stations
        { station_code: 'SML', station_name: 'Shimla', state_code: 'HP', zone_code: 'NR' },
        { station_code: 'DLI', station_name: 'Darjeeling', state_code: 'WB', zone_code: 'NFR' },
        { station_code: 'OOTC', station_name: 'Ooty', state_code: 'TN', zone_code: 'SR' },
      ];

      return majorStations;
    } catch (error) {
      console.error('Error fetching stations:', error);
      return [];
    }
  }

  // Search trains between stations
  async searchTrains(fromStation: string, toStation: string, date: string): Promise<IRTrain[]> {
    try {
      // Mock data with realistic Indian trains
      const mockTrains: IRTrain[] = [
        {
          train_number: '12301',
          train_name: 'Howrah Rajdhani Express',
          from_station_code: fromStation,
          from_station_name: this.getStationName(fromStation),
          to_station_code: toStation,
          to_station_name: this.getStationName(toStation),
          departure_time: '16:55',
          arrival_time: '09:55+1',
          travel_time: '17h 00m',
          distance: '1444 km',
          classes: ['1A', '2A', '3A'],
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        {
          train_number: '12002',
          train_name: 'New Delhi Shatabdi Express',
          from_station_code: fromStation,
          from_station_name: this.getStationName(fromStation),
          to_station_code: toStation,
          to_station_name: this.getStationName(toStation),
          departure_time: '06:00',
          arrival_time: '14:05',
          travel_time: '8h 05m',
          distance: '448 km',
          classes: ['CC', 'EC'],
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        },
        {
          train_number: '12626',
          train_name: 'Kerala Express',
          from_station_code: fromStation,
          from_station_name: this.getStationName(fromStation),
          to_station_code: toStation,
          to_station_name: this.getStationName(toStation),
          departure_time: '11:45',
          arrival_time: '11:00+1',
          travel_time: '23h 15m',
          distance: '1687 km',
          classes: ['1A', '2A', '3A', 'SL'],
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        {
          train_number: '12951',
          train_name: 'Mumbai Rajdhani Express',
          from_station_code: fromStation,
          from_station_name: this.getStationName(fromStation),
          to_station_code: toStation,
          to_station_name: this.getStationName(toStation),
          departure_time: '16:00',
          arrival_time: '08:35+1',
          travel_time: '16h 35m',
          distance: '1384 km',
          classes: ['1A', '2A', '3A'],
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        {
          train_number: '22691',
          train_name: 'Rajdhani Express',
          from_station_code: fromStation,
          from_station_name: this.getStationName(fromStation),
          to_station_code: toStation,
          to_station_name: this.getStationName(toStation),
          departure_time: '20:05',
          arrival_time: '07:40+1',
          travel_time: '11h 35m',
          distance: '846 km',
          classes: ['1A', '2A', '3A'],
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }
      ];

      return mockTrains;
    } catch (error) {
      console.error('Error searching trains:', error);
      return [];
    }
  }

  // Get train schedule with all stops
  async getTrainSchedule(trainNumber: string): Promise<IRTrainSchedule | null> {
    try {
      // Mock schedule data
      const mockSchedule: IRTrainSchedule = {
        train_number: trainNumber,
        train_name: this.getTrainName(trainNumber),
        stations: [
          {
            station_code: 'NDLS',
            station_name: 'New Delhi',
            arrival_time: 'Source',
            departure_time: '16:55',
            halt_time: '0m',
            distance: '0',
            day: 1
          },
          {
            station_code: 'GZB',
            station_name: 'Ghaziabad',
            arrival_time: '17:28',
            departure_time: '17:30',
            halt_time: '2m',
            distance: '19',
            day: 1
          },
          {
            station_code: 'MB',
            station_name: 'Moradabad',
            arrival_time: '19:28',
            departure_time: '19:33',
            halt_time: '5m',
            distance: '164',
            day: 1
          },
          {
            station_code: 'BE',
            station_name: 'Bareilly',
            arrival_time: '20:28',
            departure_time: '20:30',
            halt_time: '2m',
            distance: '230',
            day: 1
          },
          {
            station_code: 'LKO',
            station_name: 'Lucknow',
            arrival_time: '23:40',
            departure_time: '23:50',
            halt_time: '10m',
            distance: '506',
            day: 1
          },
          {
            station_code: 'ALD',
            station_name: 'Allahabad Junction',
            arrival_time: '02:28',
            departure_time: '02:33',
            halt_time: '5m',
            distance: '739',
            day: 2
          },
          {
            station_code: 'MGS',
            station_name: 'Mughal Sarai Junction',
            arrival_time: '04:07',
            departure_time: '04:17',
            halt_time: '10m',
            distance: '856',
            day: 2
          },
          {
            station_code: 'PNBE',
            station_name: 'Patna Junction',
            arrival_time: '06:00',
            departure_time: '06:05',
            halt_time: '5m',
            distance: '995',
            day: 2
          },
          {
            station_code: 'ASN',
            station_name: 'Asansol Junction',
            arrival_time: '08:53',
            departure_time: '08:55',
            halt_time: '2m',
            distance: '1240',
            day: 2
          },
          {
            station_code: 'HWH',
            station_name: 'Howrah Junction',
            arrival_time: '09:55',
            departure_time: 'Destination',
            halt_time: '0m',
            distance: '1444',
            day: 2
          }
        ]
      };

      return mockSchedule;
    } catch (error) {
      console.error('Error fetching train schedule:', error);
      return null;
    }
  }

  // Get seat availability
  async getSeatAvailability(
    trainNumber: string,
    fromStation: string,
    toStation: string,
    date: string,
    classType: string
  ): Promise<IRSeatAvailability | null> {
    try {
      // Mock availability data
      const availabilityStatuses = [
        'AVAILABLE-142',
        'AVAILABLE-89',
        'AVAILABLE-23',
        'RAC-15/WL-45',
        'WL-89/WL-156',
        'GNWL-45/GNWL-78'
      ];

      const confirmProbabilities = ['Confirmed', 'High', 'Medium', 'Low', 'Remote'];

      const mockAvailability: IRSeatAvailability = {
        train_number: trainNumber,
        class_type: classType,
        date: date,
        from_station: fromStation,
        to_station: toStation,
        current_status: availabilityStatuses[Math.floor(Math.random() * availabilityStatuses.length)],
        confirm_probability: confirmProbabilities[Math.floor(Math.random() * confirmProbabilities.length)]
      };

      return mockAvailability;
    } catch (error) {
      console.error('Error fetching seat availability:', error);
      return null;
    }
  }

  // Helper methods
  private getStationName(stationCode: string): string {
    const stationMap: { [key: string]: string } = {
      'NDLS': 'New Delhi',
      'CSMT': 'Mumbai CST',
      'MAS': 'Chennai Central',
      'HWH': 'Howrah Junction',
      'SBC': 'Bangalore City',
      'SC': 'Secunderabad Junction',
      'PUNE': 'Pune Junction',
      'ADI': 'Ahmedabad Junction'
    };
    return stationMap[stationCode] || stationCode;
  }

  private getTrainName(trainNumber: string): string {
    const trainMap: { [key: string]: string } = {
      '12301': 'Howrah Rajdhani Express',
      '12002': 'New Delhi Shatabdi Express',
      '12626': 'Kerala Express',
      '12951': 'Mumbai Rajdhani Express',
      '22691': 'Rajdhani Express'
    };
    return trainMap[trainNumber] || `Train ${trainNumber}`;
  }
}

export const indianRailwayAPI = new IndianRailwayAPI();