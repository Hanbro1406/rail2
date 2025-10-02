import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, AlertCircle, X, Download, Image, Clock } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Booking } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { generateTicketPDF, generateTicketImage } from '../utils/pdfGenerator';

interface BookingHistoryProps {
  onViewChange: (view: string) => void;
}

const BookingHistory: React.FC<BookingHistoryProps> = ({ onViewChange }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingPnr, setCancellingPnr] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userBookings = await api.getUserBookings(user.user_id);
      setBookings(userBookings);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (pnrNumber: string) => {
    if (!user) return;

    if (!confirm(`Are you sure you want to cancel ticket ${pnrNumber}?`)) {
      return;
    }

    try {
      setCancellingPnr(pnrNumber);
      await api.cancelTicket(pnrNumber, user.user_id);
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.pnr_number === pnrNumber 
          ? { ...booking, status: 'CANCELLED' }
          : booking
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel ticket');
    } finally {
      setCancellingPnr(null);
    }
  };

  const handleDownloadPDF = async (booking: Booking) => {
    try {
      await generateTicketPDF(booking);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleDownloadImage = async (booking: Booking) => {
    try {
      await generateTicketImage(booking);
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to generate image. Please try again.');
    }
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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Bookings</h2>
          <p className="text-gray-600">View and manage your train reservations</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Bookings Found
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't made any train reservations yet.
            </p>
            <button
              onClick={() => onViewChange('search')}
              className="bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Book Your First Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div
                key={booking.booking_id}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {booking.train?.train_name || `Train ${booking.train_id}`}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : booking.status === 'WAITING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">PNR Number</p>
                        <p className="font-mono text-lg font-semibold text-blue-800">
                          {booking.pnr_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Travel Date</p>
                        <p className="font-medium">
                          {new Date(booking.travel_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Class</p>
                        <p className="font-medium">{booking.booking_class || 'Sleeper'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="font-medium text-emerald-600">₹{booking.total_amount?.toLocaleString() || '0'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {booking.train?.source_station?.station_name || 'Source'} →{' '}
                          {booking.train?.destination_station?.station_name || 'Destination'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {booking.passengers?.length || 0} passenger(s)
                        </span>
                      </div>
                    </div>

                    {booking.passengers && booking.passengers.length > 0 && (
                      <div className="border-t pt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Passengers:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {booking.passengers.map(passenger => (
                            <div
                              key={passenger.passenger_id}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {passenger.passenger_name} ({passenger.age}y, {passenger.gender})
                              </span>
                              <span className="text-gray-500">
                                {booking.status === 'CONFIRMED' ? `Seat ${passenger.seat_number}` : 'Waiting List'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                    {/* Download Options */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDownloadPDF(booking)}
                        className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
                      >
                        <Download className="h-3 w-3" />
                        <span>PDF</span>
                      </button>
                      <button
                        onClick={() => handleDownloadImage(booking)}
                        className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm hover:bg-purple-200 transition-colors"
                      >
                        <Image className="h-3 w-3" />
                        <span>Image</span>
                      </button>
                    </div>

                    {/* Cancel Button */}
                    {(booking.status === 'CONFIRMED' || booking.status === 'WAITING') && (
                      <button
                        onClick={() => handleCancelTicket(booking.pnr_number)}
                        disabled={cancellingPnr === booking.pnr_number}
                        className="flex items-center justify-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {cancellingPnr === booking.pnr_number ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        <span>Cancel Ticket</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;