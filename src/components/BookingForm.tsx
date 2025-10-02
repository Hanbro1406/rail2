import React, { useState } from 'react';
import { Plus, Trash2, ArrowLeft, CreditCard } from 'lucide-react';
import { Train, Passenger } from '../types';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface BookingFormProps {
  train: Train;
  travelDate: string;
  onBack: () => void;
  onBookingComplete: (pnr: string) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  train, 
  travelDate, 
  onBack, 
  onBookingComplete 
}) => {
  const { user } = useAuth();
  const [passengers, setPassengers] = useState<Passenger[]>([
    { passenger_name: '', age: 0, gender: 'Male' }
  ]);
  const [bookingClass, setBookingClass] = useState('AC 3-Tier');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pricing for different classes
  const classPricing = {
    'AC 1st Class': 2500,
    'AC 2-Tier': 1800,
    'AC 3-Tier': 1200,
    'Sleeper': 850,
    'General': 400,
  };

  const addPassenger = () => {
    if (passengers.length < 6) {
      setPassengers(prev => [...prev, { passenger_name: '', age: 0, gender: 'Male' }]);
    }
  };

  const removePassenger = (index: number) => {
    if (passengers.length > 1) {
      setPassengers(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updatePassenger = (index: number, field: keyof Passenger, value: string | number) => {
    setPassengers(prev => prev.map((passenger, i) => 
      i === index ? { ...passenger, [field]: value } : passenger
    ));
  };

  const validateForm = () => {
    for (const passenger of passengers) {
      if (!passenger.passenger_name.trim()) {
        return 'Please enter names for all passengers';
      }
      if (passenger.age < 1 || passenger.age > 120) {
        return 'Please enter valid ages for all passengers';
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!user) {
      setError('User not found. Please login again.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const bookingRequest = {
        user_id: user.user_id,
        train_id: train.train_id,
        travel_date: travelDate,
        passengers: passengers,
        booking_class: bookingClass,
      };

      const response = await api.bookTicket(bookingRequest);
      onBookingComplete(response.pnr_number);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const basePrice = classPricing[bookingClass as keyof typeof classPricing] || 850;
  const totalAmount = passengers.length * basePrice;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Book Your Ticket</h2>
              <p className="text-gray-600">Complete your booking details</p>
            </div>
          </div>

          {/* Train Details Summary */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{train.train_name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">From:</span> {train.source_station?.station_name}
              </div>
              <div>
                <span className="font-medium">To:</span> {train.destination_station?.station_name}
              </div>
              <div>
                <span className="font-medium">Date:</span> {new Date(travelDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Passenger Details */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Passenger Details ({passengers.length}/6)
                </h3>
                {passengers.length < 6 && (
                  <button
                    type="button"
                    onClick={addPassenger}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Passenger</span>
                  </button>
                )}
              </div>

              {/* Class Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Class
                </label>
                <select
                  value={bookingClass}
                  onChange={(e) => setBookingClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {train.train_type === 'Rajdhani' || train.train_type === 'Shatabdi' ? (
                    <>
                      <option value="AC 1st Class">AC 1st Class - ₹2,500</option>
                      <option value="AC 2-Tier">AC 2-Tier - ₹1,800</option>
                      <option value="AC 3-Tier">AC 3-Tier - ₹1,200</option>
                    </>
                  ) : (
                    <>
                      <option value="AC 3-Tier">AC 3-Tier - ₹1,200</option>
                      <option value="Sleeper">Sleeper - ₹850</option>
                      <option value="General">General - ₹400</option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-4">
                {passengers.map((passenger, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        Passenger {index + 1}
                      </h4>
                      {passengers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePassenger(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={passenger.passenger_name}
                          onChange={(e) => updatePassenger(index, 'passenger_name', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Age *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="120"
                          value={passenger.age || ''}
                          onChange={(e) => updatePassenger(index, 'age', parseInt(e.target.value) || 0)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Age"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender *
                        </label>
                        <select
                          value={passenger.gender}
                          onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Travel Class:</span>
                  <span>{bookingClass}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Fare (per passenger):</span>
                  <span>₹{basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of Passengers:</span>
                  <span>{passengers.length}</span>
                </div>
                {train.available_seats === 0 && (
                  <div className="flex justify-between text-amber-600">
                    <span>Status:</span>
                    <span>Waiting List</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total Amount:</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing booking...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Confirm Booking - ₹{totalAmount.toLocaleString()}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;