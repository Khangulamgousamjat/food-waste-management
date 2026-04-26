import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Filter, Search, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Food listing type
interface FoodListing {
  id: string;
  name: string;
  description: string;
  quantity: string;
  expiration: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  food_type: string;
  donor_id: string;
  donor_name: string;
  created_at: string;
  urgency: 'low' | 'medium' | 'high';
}

// Karnataka locations
const LOCATIONS = {
  TIPTUR: { lat: 13.2565, lng: 76.4777, name: 'Tiptur' },
  TUMKUR: { lat: 13.3415, lng: 77.1010, name: 'Tumakuru' },
  TUREVEKERE: { lat: 13.9927, lng: 76.4767, name: 'Turevekere' }
};

// Center the map on Tumakuru
const defaultCenter: [number, number] = [13.3415, 77.1010]; // Tumakuru coordinates
const defaultZoom = 11; // Adjusted zoom level for better view of Tumakuru

// Component to handle map view changes
const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    try {
      map.setView(center);
    } catch (error) {
      console.error('Error setting map view:', error);
    }
  }, [center, map]);
  
  return null;
};

const MapPage: React.FC = () => {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [filters, setFilters] = useState({
    foodType: '',
    urgency: '',
    distance: 10, // in km
  });
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Mock data for food listings
  const mockListings: FoodListing[] = [
    {
      id: '1',
      name: 'Fresh Bread',
      description: 'Day-old artisan bread from local bakery',
      quantity: '12 loaves',
      expiration: '2025-05-21',
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Main St, New York, NY'
      },
      food_type: 'Bakery',
      donor_id: 'user1',
      donor_name: 'Downtown Bakery',
      created_at: '2025-05-20T08:00:00Z',
      urgency: 'medium'
    },
    {
      id: '2',
      name: 'Organic Vegetables',
      description: 'Mixed vegetables from farmers market',
      quantity: '5 kg',
      expiration: '2025-05-22',
      location: {
        latitude: 40.7200,
        longitude: -73.9950,
        address: '45 Green Ave, Brooklyn, NY'
      },
      food_type: 'Produce',
      donor_id: 'user2',
      donor_name: 'Green Earth Market',
      created_at: '2025-05-20T10:30:00Z',
      urgency: 'high'
    },
    {
      id: '3',
      name: 'Canned Goods',
      description: 'Assorted canned vegetables and soups',
      quantity: '24 cans',
      expiration: '2025-08-15',
      location: {
        latitude: 40.7300,
        longitude: -74.0100,
        address: '78 West St, Jersey City, NJ'
      },
      food_type: 'Canned',
      donor_id: 'user3',
      donor_name: 'Community Pantry',
      created_at: '2025-05-19T14:15:00Z',
      urgency: 'low'
    }
  ];

  // Load food listings data
  useEffect(() => {
    const loadListings = async () => {
      try {
        setIsLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setListings(mockListings);
        setMapError(null);
      } catch (error) {
        console.error('Error loading listings:', error);
        setMapError('Failed to load food listings');
      } finally {
        setIsLoading(false);
      }
    };

    loadListings();
  }, [filters]);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current && !isLoading && !mapError) {
      try {
        // Create map instance
        const map = L.map(mapContainerRef.current, {
          center: defaultCenter,
          zoom: defaultZoom,
          zoomControl: true,
          attributionControl: true,
        });

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Store map reference
        mapRef.current = map;
        setMapReady(true);

        // Add location markers
        Object.values(LOCATIONS).forEach(location => {
          const marker = L.marker([location.lat, location.lng])
            .addTo(map)
            .bindPopup(`
              <div class="p-2">
                <h3 class="font-bold text-lg mb-2">${location.name}</h3>
                <p class="text-gray-600">Karnataka, India</p>
              </div>
            `);
        });

        // Add food listing markers
        listings.forEach(listing => {
          const marker = L.marker(
            [listing.location.latitude, listing.location.longitude],
            { icon: createCustomIcon(listing.urgency) }
          ).addTo(map);

          marker.bindPopup(`
            <div class="p-2">
              <h3 class="font-bold text-lg mb-2">${listing.name}</h3>
              <p class="text-gray-600 mb-2">${listing.description}</p>
              <p class="text-sm text-gray-500">
                <span class="inline-block mr-1">⏰</span>
                Expires: ${new Date(listing.expiration).toLocaleDateString()}
              </p>
            </div>
          `);

          marker.on('click', () => handleListingClick(listing));
        });

        // Force a resize event to ensure proper rendering
        setTimeout(() => {
          map.invalidateSize();
        }, 100);

        return () => {
          if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
          }
        };
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to initialize map');
      }
    }
  }, [isLoading, mapError, listings]);

  // Update map center when it changes
  useEffect(() => {
    if (mapRef.current && mapReady) {
      mapRef.current.setView(mapCenter);
      // Force a resize event to ensure proper rendering
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    }
  }, [mapCenter, mapReady]);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const getMarkerColor = useCallback((urgency: string) => {
    switch (urgency) {
      case 'high':
        return '#ef4444'; // red
      case 'medium':
        return '#f97316'; // orange
      case 'low':
        return '#22c55e'; // green
      default:
        return '#3b82f6'; // blue
    }
  }, []);

  const createCustomIcon = useCallback((urgency: string) => {
    try {
      return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background-color: ${getMarkerColor(urgency)};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
    } catch (error) {
      console.error('Error creating custom icon:', error);
      return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background-color: #3b82f6;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
    }
  }, [getMarkerColor]);

  const handleListingClick = useCallback((listing: FoodListing) => {
    try {
      setSelectedListing(listing);
      setMapCenter([listing.location.latitude, listing.location.longitude]);
    } catch (error) {
      console.error('Error handling listing click:', error);
    }
  }, []);

  return (
    <section className="min-h-screen pt-20 pb-16">
      <div className="container-custom">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Food Sharing Map - Tumakuru</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover food donations available in Tumakuru and surrounding areas (Tiptur, Turevekere).
          </p>
        </div>
        
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search for food or location..." 
              className="pl-10 w-full input-field"
            />
          </div>
          
          {/* Filter button */}
          <button 
            className="btn-outline py-2 flex items-center"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </button>
        </div>
        
        {/* Filters panel */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-4 mb-6"
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isFilterOpen ? 'auto' : 0,
            opacity: isFilterOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          style={{ overflow: 'hidden' }}
        >
          {isFilterOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Food Type
                </label>
                <select 
                  name="foodType"
                  value={filters.foodType}
                  onChange={handleFilterChange}
                  className="w-full input-field"
                >
                  <option value="">All Types</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Produce">Produce</option>
                  <option value="Canned">Canned</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency
                </label>
                <select 
                  name="urgency"
                  value={filters.urgency}
                  onChange={handleFilterChange}
                  className="w-full input-field"
                >
                  <option value="">All Urgency Levels</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distance (km)
                </label>
                <input 
                  type="range"
                  name="distance"
                  min="1"
                  max="50"
                  value={filters.distance}
                  onChange={handleFilterChange}
                  className="w-full"
                />
                <span className="text-sm text-gray-600">{filters.distance} km</span>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Map Container */}
        <div 
          ref={mapContainerRef}
          className="relative h-[70vh] w-full rounded-lg overflow-hidden shadow-lg bg-gray-100"
          style={{ minHeight: '500px' }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
          )}
          
          {mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="text-center">
                <p className="text-red-500 mb-4">{mapError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Listing Details */}
        {selectedListing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-bold mb-4">{selectedListing.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-4">{selectedListing.description}</p>
                <p className="mb-2">
                  <span className="font-semibold">Quantity:</span> {selectedListing.quantity}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Location:</span> {selectedListing.location.address}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Donor:</span> {selectedListing.donor_name}
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <span className="font-semibold">Food Type:</span> {selectedListing.food_type}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Urgency:</span>{' '}
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    selectedListing.urgency === 'high' ? 'bg-red-100 text-red-800' :
                    selectedListing.urgency === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedListing.urgency.charAt(0).toUpperCase() + selectedListing.urgency.slice(1)}
                  </span>
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Expiration:</span>{' '}
                  {new Date(selectedListing.expiration).toLocaleDateString()}
                </p>
                <button className="btn-primary mt-4">
                  Contact Donor
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MapPage;