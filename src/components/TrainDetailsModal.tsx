import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, Info, Users } from 'lucide-react';
import { Train, TrainStop } from '../types';
import { api } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

interface TrainDetailsModalProps {
  trainId: number;
  isOpen: boolean;
  onClose: () => void;
  onBookNow?: (train: Train) => void;
}

const TrainDetailsModal: React.FC<TrainDetailsModalProps> = ({ 
  trainId, 
  isOpen, 
  onClose, 
  onBookNow 
}) => {
  const [train, setTrain] = useState<Train | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'stops'>('details');

  useEffect(() => {
    if (isOpen && trainId) {
      loadTrainDetails();
    }
  }, [isOpen, trainId]);

  const loadTrainDetails = async () => {
    try {
      setLoading(true);
      const trainData = await api.getTrainDetails(trainId);
      setTrain(trainData);
    } catch (error) {
      console.error('Failed to load train details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {train?.train_name || 'Train Details'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : train ? (
          <div className="flex flex-col h-full">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'details'
                    ? 'text-blue-800 border-b-2 border-blue-800'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Info className="inline h-4 w-4 mr-2" />
                Train Details
              </button>
              <button
                onClick={() => setActiveTab('stops')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'stops'
                    ? 'text-blue-800 border-b-2 border-blue-800'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MapPin className="inline h-4 w-4 mr-2" />
                Train Stops
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Route Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">From:</span>
                          <span className="font-medium">{train.source_station?.station_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">To:</span>
                          <span className="font-medium">{train.destination_station?.station_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Departure:</span>
                          <span className="font-medium">{train.departure_time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Arrival:</span>
                          <span className="font-medium">{train.arrival_time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{train.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Seats:</span>
                          <span className="font-medium">{train.total_seats}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Available:</span>
                          <span className="font-medium text-emerald-600">{train.available_seats}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Waiting List:</span>
                          <span className="font-medium text-amber-600">{train.waiting_list}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Train Type:</span>
                          <span className="font-medium">{train.train_type}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Classes and Pricing */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Available Classes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3 border">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">AC 1st Class</span>
                          <span className="text-emerald-600 font-bold">₹2,500</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Available: 8</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">AC 2-Tier</span>
                          <span className="text-emerald-600 font-bold">₹1,800</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Available: 15</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">AC 3-Tier</span>
                          <span className="text-emerald-600 font-bold">₹1,200</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Available: 22</p>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm">WiFi</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm">Catering</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm">Blanket</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm">Charging Point</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'stops' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Train Route & Stops</h3>
                  {train.stops?.map((stop, index) => (
                    <div key={stop.station_id} className="relative">
                      {/* Connection Line */}
                      {index < (train.stops?.length || 0) - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-blue-200"></div>
                      )}
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            index === 0 || index === (train.stops?.length || 0) - 1
                              ? 'bg-blue-800 text-white'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            <MapPin className="h-5 w-5" />
                          </div>
                        </div>
                        
                        <div className="flex-1 bg-white rounded-lg border p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{stop.station_name}</h4>
                              <p className="text-sm text-gray-600">{stop.station_code}</p>
                              {stop.platform && (
                                <p className="text-sm text-blue-600">Platform {stop.platform}</p>
                              )}
                            </div>
                            
                            <div className="text-right">
                              <div className="flex items-center space-x-2 text-sm">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>Arr: {stop.arrival_time}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm mt-1">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>Dep: {stop.departure_time}</span>
                              </div>
                              {stop.halt_duration && (
                                <p className="text-xs text-amber-600 mt-1">
                                  Halt: {stop.halt_duration}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-emerald-600">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold">{train.available_seats}</span>
                    <span className="text-sm">available</span>
                  </div>
                  {train.waiting_list && train.waiting_list > 0 && (
                    <div className="flex items-center space-x-1 text-amber-600">
                      <Clock className="h-4 w-4" />
                      <span className="font-semibold">{train.waiting_list}</span>
                      <span className="text-sm">waiting</span>
                    </div>
                  )}
                </div>
                
                {onBookNow && (
                  <button
                    onClick={() => onBookNow(train)}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-600">Train details not found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainDetailsModal;