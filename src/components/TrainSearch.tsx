import React, { useState, useEffect } from 'react';
import { Search, ArrowRightLeft, Calendar, MapPin, Users, Clock, Info } from 'lucide-react';
import { api } from '../services/api';
import { Station, Train, SearchParams } from '../types';
import LoadingSpinner from './LoadingSpinner';
import TrainDetailsModal from './TrainDetailsModal';

interface TrainSearchProps {
  onBookingSelect: (train: Train, travelDate: string) => void;
}

const TrainSearch: React.FC<TrainSearchProps> = ({ onBookingSelect }) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    from: '',
    to: '',
    date: '',
  });
  const [searchResults, setSearchResults] = useState<Train[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [selectedTrainId, setSelectedTrainId] = useState<number | null>(null);

  useEffect(() => {
    loadStations();
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSearchParams(prev => ({
      ...prev,
      date: tomorrow.toISOString().split('T')[0],
    }));
  }, []);

  const loadStations = async () => {
    try {
      setLoading(true);
      const stationData = await api.getStations();
      setStations(stationData);
    } catch (err) {
      setError('Failed to load stations');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchParams.from || !searchParams.to || !searchParams.date) {
      setError('Please fill in all search fields');
      return;
    }

    if (searchParams.from === searchParams.to) {
      setError('Source and destination stations cannot be the same');
      return;
    }

    try {
      setSearching(true);
      setError('');
      const results = await api.searchTrains(searchParams);
      setSearchResults(results);
      
      if (results.length === 0) {
        setError('No trains found for the selected route and date');
      }
    } catch (err) {
      setError('Failed to search trains. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const swapStations = () => {
    setSearchParams(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const handleChange = (field: keyof SearchParams, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Search Trains
          </h2>

          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* From Station */}
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  From
                </label>
                <select
                  value={searchParams.from}
                  onChange={(e) => handleChange('from', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select departure station</option>
                  {stations.map(station => (
                    <option key={station.station_id} value={station.station_code}>
                      {station.station_name} ({station.station_code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={swapStations}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  title="Swap stations"
                >
                  <ArrowRightLeft className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* To Station */}
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  To
                </label>
                <select
                  value={searchParams.to}
                  onChange={(e) => handleChange('to', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select arrival station</option>
                  {stations.map(station => (
                    <option key={station.station_id} value={station.station_code}>
                      {station.station_name} ({station.station_code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Travel Date
                </label>
                <input
                  type="date"
                  value={searchParams.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="text-center">
              <button
                type="submit"
                disabled={searching}
                className="bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center mx-auto"
              >
                {searching ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Searching trains...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Search Trains
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Available Trains ({searchResults.length} found)
            </h3>

            {searchResults.map(train => (
              <div key={train.train_id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h4 className="text-xl font-semibold text-gray-900">
                        {train.train_name}
                      </h4>
                      <span className="text-sm text-gray-500">
                        Train ID: {train.train_id}
                      </span>
                    </div>

                    <div className="flex items-center space-x-6 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{train.source_station?.station_name}</span>
                        <span className="text-gray-400">→</span>
                        <span>{train.destination_station?.station_name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Departure: 08:00 AM</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6 flex items-center space-x-4">
                    <div className="text-center">
                      <div className="flex items-center space-x-1 text-emerald-600">
                        <Users className="h-4 w-4" />
                        <span className="font-semibold">{train.available_seats}</span>
                      </div>
                      <p className="text-xs text-gray-500">seats available</p>
                      {train.waiting_list && train.waiting_list > 0 && (
                        <p className="text-xs text-amber-600 mt-1">
                          WL: {train.waiting_list}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedTrainId(train.train_id)}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center space-x-1"
                      >
                        <Info className="h-4 w-4" />
                        <span>Details</span>
                      </button>
                      
                      <button
                        onClick={() => onBookingSelect(train, searchParams.date)}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                      >
                        {train.available_seats && train.available_seats > 0 ? 'Book Now' : 'Join Waitlist'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchResults.length === 0 && !searching && !error && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Search for trains to see available options
            </p>
          </div>
        )}

        {/* Train Details Modal */}
        <TrainDetailsModal
          trainId={selectedTrainId || 0}
          isOpen={selectedTrainId !== null}
          onClose={() => setSelectedTrainId(null)}
          onBookNow={(train) => {
            setSelectedTrainId(null);
            onBookingSelect(train, searchParams.date);
          }}
        />
      </div>
    </div>
  );
};

export default TrainSearch;