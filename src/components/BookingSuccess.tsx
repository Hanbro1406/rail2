import React from 'react';
import { CheckCircle, Download, Share, ArrowLeft } from 'lucide-react';

interface BookingSuccessProps {
  pnr: string;
  onViewChange: (view: string) => void;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({ pnr, onViewChange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600">
            Your train ticket has been booked successfully
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Your PNR Number</p>
          <p className="text-2xl font-bold text-blue-800 tracking-wider">
            {pnr}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Please save this PNR number for future reference
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <button className="w-full flex items-center justify-center space-x-2 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition-colors">
            <Download className="h-4 w-4" />
            <span>Download Ticket</span>
          </button>
          
          <button className="w-full flex items-center justify-center space-x-2 bg-emerald-100 text-emerald-700 py-2 rounded-lg hover:bg-emerald-200 transition-colors">
            <Share className="h-4 w-4" />
            <span>Share Ticket</span>
          </button>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onViewChange('bookings')}
            className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View My Bookings
          </button>
          
          <button
            onClick={() => onViewChange('search')}
            className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 py-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Book Another Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;