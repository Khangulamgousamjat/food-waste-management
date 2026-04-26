import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserDonations, getUserRequests } from '../lib/supabase';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  Package, 
  ShoppingBasket, 
  BarChart, 
  Award, 
  Clock,
  MapPin,
  Calendar,
  Check,
  X
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('donations');
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      
      try {
        if (user) {
          // Load relevant data based on account type
          if (profile?.account_type === 'donor') {
            const { data: donationsData } = await getUserDonations(user.id);
            setDonations(donationsData || []);
          } else {
            const { data: requestsData } = await getUserRequests(user.id);
            setRequests(requestsData || []);
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user, profile]);
  
  // Mock data for dashboard
  const mockDonations = [
    {
      id: '1',
      name: 'Fresh Bread Assortment',
      description: 'Various types of day-old bread from our bakery',
      quantity: '12 loaves',
      expiration: '2025-05-21',
      created_at: '2025-05-20T08:30:00Z',
      status: 'available',
      requests_count: 2
    },
    {
      id: '2',
      name: 'Organic Produce',
      description: 'Mixed fruits and vegetables, still fresh but won\'t sell',
      quantity: '15 kg',
      expiration: '2025-05-22',
      created_at: '2025-05-19T14:45:00Z',
      status: 'claimed',
      requests_count: 3
    },
    {
      id: '3',
      name: 'Pasta Dishes',
      description: 'Leftover pasta from catering event, properly stored',
      quantity: '8 portions',
      expiration: '2025-05-21',
      created_at: '2025-05-20T10:15:00Z',
      status: 'completed',
      requests_count: 1
    }
  ];
  
  const mockRequests = [
    {
      id: '1',
      food_listing: {
        id: '101',
        name: 'Fresh Produce',
        description: 'Assorted vegetables and fruits',
        donor_name: 'Green Grocer',
        expiration: '2025-05-22'
      },
      status: 'pending',
      created_at: '2025-05-20T09:45:00Z'
    },
    {
      id: '2',
      food_listing: {
        id: '102',
        name: 'Baked Goods',
        description: 'Day-old bagels, bread, and pastries',
        donor_name: 'Downtown Bakery',
        expiration: '2025-05-21'
      },
      status: 'approved',
      created_at: '2025-05-19T16:30:00Z'
    },
    {
      id: '3',
      food_listing: {
        id: '103',
        name: 'Canned Goods',
        description: 'Assorted canned vegetables and soups',
        donor_name: 'Community Pantry',
        expiration: '2025-08-15'
      },
      status: 'completed',
      created_at: '2025-05-18T11:20:00Z'
    }
  ];
  
  const mockImpactStats = {
    total_donations: profile?.account_type === 'donor' ? 38 : 0,
    total_received: profile?.account_type === 'recipient' ? 27 : 0,
    meals_contributed: profile?.account_type === 'donor' ? 152 : 0,
    meals_received: profile?.account_type === 'recipient' ? 108 : 0,
    co2_saved: profile?.account_type === 'donor' ? 76.4 : 0,
    points: 1250,
    badges: [
      { id: 1, name: 'First Donation', icon: '🎁' },
      { id: 2, name: 'Food Hero', icon: '🦸' },
      { id: 3, name: 'Consistent Contributor', icon: '📅' }
    ]
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-custom">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {profile?.full_name || user?.email}
          </h1>
          <p className="text-gray-600">
            {profile?.account_type === 'donor' 
              ? 'Manage your food donations and track your impact' 
              : 'Browse food listings and manage your requests'}
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">
                  {profile?.account_type === 'donor' ? 'Total Donations' : 'Total Received'}
                </p>
                <p className="text-2xl font-bold">
                  {profile?.account_type === 'donor' ? mockImpactStats.total_donations : mockImpactStats.total_received}
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-lg">
                <ShoppingBasket className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">
                  {profile?.account_type === 'donor' ? 'Meals Contributed' : 'Meals Received'}
                </p>
                <p className="text-2xl font-bold">
                  {profile?.account_type === 'donor' ? mockImpactStats.meals_contributed : mockImpactStats.meals_received}
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-lg">
                <BarChart className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">CO₂ Emissions Saved</p>
                <p className="text-2xl font-bold">{mockImpactStats.co2_saved} kg</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-lg">
                <Award className="h-6 w-6 text-accent-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Impact Points</p>
                <p className="text-2xl font-bold">{mockImpactStats.points}</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Food Listings/Requests */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b">
                <button
                  className={`px-6 py-4 text-sm font-medium flex-1 text-center ${
                    activeTab === 'donations' 
                      ? 'text-primary-600 border-b-2 border-primary-500' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('donations')}
                >
                  {profile?.account_type === 'donor' ? 'My Donations' : 'Available Food'}
                </button>
                
                <button
                  className={`px-6 py-4 text-sm font-medium flex-1 text-center ${
                    activeTab === 'requests' 
                      ? 'text-primary-600 border-b-2 border-primary-500' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('requests')}
                >
                  {profile?.account_type === 'donor' ? 'Requests Received' : 'My Requests'}
                </button>
              </div>
              
              {/* Tab Content */}
              <div className="p-6">
                {/* Header with Action Button */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    {activeTab === 'donations' 
                      ? (profile?.account_type === 'donor' ? 'Your Food Donations' : 'Available Food Listings')
                      : (profile?.account_type === 'donor' ? 'Requests for Your Food' : 'Your Food Requests')
                    }
                  </h2>
                  
                  {profile?.account_type === 'donor' && activeTab === 'donations' && (
                    <Link to="/donate" className="btn-primary py-2 flex items-center">
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Add Donation
                    </Link>
                  )}
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {activeTab === 'donations' ? (
                      profile?.account_type === 'donor' ? (
                        // Donor's donations
                        mockDonations.length > 0 ? (
                          mockDonations.map(donation => (
                            <div key={donation.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex justify-between">
                                <h3 className="font-medium">{donation.name}</h3>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  donation.status === 'available' 
                                    ? 'bg-success-100 text-success-700' 
                                    : donation.status === 'claimed' 
                                      ? 'bg-warning-100 text-warning-700' 
                                      : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                                </span>
                              </div>
                              
                              <p className="text-sm text-gray-600 mt-1">{donation.description}</p>
                              
                              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Package className="w-3 h-3 mr-1" />
                                  {donation.quantity}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Expires: {new Date(donation.expiration).toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Listed: {new Date(donation.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              
                              <div className="mt-4 flex justify-between items-center">
                                <span className="text-sm text-primary-600">
                                  {donation.requests_count} request{donation.requests_count !== 1 ? 's' : ''}
                                </span>
                                <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                                  View Details
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">You haven't added any donations yet.</p>
                            <Link to="/donate" className="btn-primary py-2">
                              Add Your First Donation
                            </Link>
                          </div>
                        )
                      ) : (
                        // Recipient browsing available food
                        <div className="space-y-4">
                          {mockDonations.filter(d => d.status === 'available').map(listing => (
                            <div key={listing.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <h3 className="font-medium">{listing.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{listing.description}</p>
                              
                              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Package className="w-3 h-3 mr-1" />
                                  {listing.quantity}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Expires: {new Date(listing.expiration).toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  2.3 km away
                                </span>
                              </div>
                              
                              <div className="mt-4 flex justify-end">
                                <button className="btn-primary py-1.5 px-4 text-sm">
                                  Request Food
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    ) : (
                      // Requests tab (for both donors and recipients)
                      profile?.account_type === 'donor' ? (
                        // Requests received by the donor
                        mockRequests.map(request => (
                          <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between">
                              <h3 className="font-medium">Request for: {request.food_listing.name}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                request.status === 'pending' 
                                  ? 'bg-warning-100 text-warning-700' 
                                  : request.status === 'approved' 
                                    ? 'bg-success-100 text-success-700' 
                                    : 'bg-gray-100 text-gray-700'
                              }`}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-1">{request.food_listing.description}</p>
                            
                            <div className="mt-3 flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              Requested: {new Date(request.created_at).toLocaleDateString()}
                            </div>
                            
                            <div className="mt-4 flex justify-end space-x-2">
                              {request.status === 'pending' && (
                                <>
                                  <button className="flex items-center py-1.5 px-3 bg-error-50 text-error-600 rounded text-sm hover:bg-error-100">
                                    <X className="w-4 h-4 mr-1" />
                                    Decline
                                  </button>
                                  <button className="flex items-center py-1.5 px-3 bg-success-50 text-success-600 rounded text-sm hover:bg-success-100">
                                    <Check className="w-4 h-4 mr-1" />
                                    Approve
                                  </button>
                                </>
                              )}
                              <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                                View Details
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        // Recipient's own requests
                        mockRequests.map(request => (
                          <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{request.food_listing.name}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                request.status === 'pending' 
                                  ? 'bg-warning-100 text-warning-700' 
                                  : request.status === 'approved' 
                                    ? 'bg-success-100 text-success-700' 
                                    : request.status === 'completed'
                                      ? 'bg-primary-100 text-primary-700'
                                      : 'bg-error-100 text-error-700'
                              }`}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-1">{request.food_listing.description}</p>
                            
                            <div className="mt-2 text-sm">
                              <span className="text-gray-600">From: </span>
                              <span className="font-medium">{request.food_listing.donor_name}</span>
                            </div>
                            
                            <div className="mt-3 flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              Requested: {new Date(request.created_at).toLocaleDateString()}
                            </div>
                            
                            <div className="mt-4 flex justify-end">
                              <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                                View Details
                              </button>
                            </div>
                          </div>
                        ))
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column: Impact & Achievements */}
          <div>
            {/* Impact Section */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-primary-500" />
                Your Impact
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Food Shared</span>
                  <span className="font-medium">
                    {profile?.account_type === 'donor' ? mockImpactStats.total_donations : mockImpactStats.total_received} items
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Meals Equivalent</span>
                  <span className="font-medium">
                    {profile?.account_type === 'donor' ? mockImpactStats.meals_contributed : mockImpactStats.meals_received} meals
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">CO₂ Saved</span>
                  <span className="font-medium">{mockImpactStats.co2_saved} kg</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Impact Points</span>
                  <span className="font-medium">{mockImpactStats.points} pts</span>
                </div>
                
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <Link to="/impact" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View detailed impact report →
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Achievements Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Award className="mr-2 h-5 w-5 text-primary-500" />
                Achievements
              </h2>
              
              <div className="space-y-4">
                {mockImpactStats.badges.map(badge => (
                  <div key={badge.id} className="flex items-center p-3 bg-primary-50 rounded-lg">
                    <div className="text-2xl mr-3">{badge.icon}</div>
                    <div>
                      <h3 className="font-medium">{badge.name}</h3>
                      <p className="text-xs text-gray-600">Earned for your contribution</p>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <Link to="/achievements" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View all achievements →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;