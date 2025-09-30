import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import AuthForm from './components/AuthForm';
import TrainSearch from './components/TrainSearch';
import BookingForm from './components/BookingForm';
import BookingSuccess from './components/BookingSuccess';
import BookingHistory from './components/BookingHistory';
import { Train } from './types';

type ViewType = 'home' | 'login' | 'signup' | 'search' | 'booking' | 'success' | 'bookings';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [travelDate, setTravelDate] = useState<string>('');
  const [successPnr, setSuccessPnr] = useState<string>('');

  const handleBookingSelect = (train: Train, date: string) => {
    setSelectedTrain(train);
    setTravelDate(date);
    setCurrentView('booking');
  };

  const handleBookingComplete = (pnr: string) => {
    setSuccessPnr(pnr);
    setCurrentView('success');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onViewChange={setCurrentView} />;
      case 'login':
        return <AuthForm mode="login" onViewChange={setCurrentView} />;
      case 'signup':
        return <AuthForm mode="signup" onViewChange={setCurrentView} />;
      case 'search':
        return <TrainSearch onBookingSelect={handleBookingSelect} />;
      case 'booking':
        return selectedTrain && travelDate ? (
          <BookingForm
            train={selectedTrain}
            travelDate={travelDate}
            onBack={() => setCurrentView('search')}
            onBookingComplete={handleBookingComplete}
          />
        ) : (
          <HomePage onViewChange={setCurrentView} />
        );
      case 'success':
        return (
          <BookingSuccess
            pnr={successPnr}
            onViewChange={setCurrentView}
          />
        );
      case 'bookings':
        return <BookingHistory onViewChange={setCurrentView} />;
      default:
        return <HomePage onViewChange={setCurrentView} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header currentView={currentView} onViewChange={setCurrentView} />
        {renderCurrentView()}
      </div>
    </AuthProvider>
  );
}

export default App;