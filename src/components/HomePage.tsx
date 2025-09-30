import React from 'react';
import { Search, Calendar, Users, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HomePageProps {
  onViewChange: (view: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onViewChange }) => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find trains between any two stations with real-time availability',
    },
    {
      icon: Calendar,
      title: 'Flexible Booking',
      description: 'Book tickets for your preferred dates with instant confirmation',
    },
    {
      icon: Users,
      title: 'Group Booking',
      description: 'Book multiple passengers in a single transaction',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your data and payments are protected with advanced security',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-800">RailBook</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your one-stop solution for railway reservations. Search, book, and manage your train tickets with ease.
          </p>
          
          {isAuthenticated ? (
            <button
              onClick={() => onViewChange('search')}
              className="bg-blue-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Search Trains Now
            </button>
          ) : (
            <div className="space-x-4">
              <button
                onClick={() => onViewChange('signup')}
                className="bg-blue-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Get Started
              </button>
              <button
                onClick={() => onViewChange('login')}
                className="bg-white text-blue-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg border-2 border-blue-800"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose RailBook?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-800" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-blue-800 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-200">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100,000+</div>
              <div className="text-blue-200">Tickets Booked</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-200">Uptime</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;