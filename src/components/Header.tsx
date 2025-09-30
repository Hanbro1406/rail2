import React from 'react';
import { Brain as Train, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:text-blue-200 transition-colors"
            onClick={() => onViewChange('home')}
          >
            <Train className="h-8 w-8" />
            <h1 className="text-2xl font-bold">RailBook</h1>
          </div>

          <nav className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => onViewChange('search')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'search'
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-blue-700'
                  }`}
                >
                  Search Trains
                </button>
                <button
                  onClick={() => onViewChange('bookings')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'bookings'
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-blue-700'
                  }`}
                >
                  My Bookings
                </button>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span className="text-sm">{user?.username}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="space-x-4">
                <button
                  onClick={() => onViewChange('login')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'login'
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-blue-700'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => onViewChange('signup')}
                  className={`px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors ${
                    currentView === 'signup' ? 'bg-emerald-700' : ''
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;