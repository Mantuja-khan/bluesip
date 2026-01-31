import React, { useState } from 'react';
import { Search, MapPin, Phone, Store, User } from 'lucide-react';
import distributor from "../assets/des.png";

const BOTTLES_PER_BOX = 12;
const MINIMUM_BOXES = 30;
const MINIMUM_BOTTLES = MINIMUM_BOXES * BOTTLES_PER_BOX; // 360 bottles

export default function DistributorsPage() {
  const [pincode, setPincode] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [distributors, setDistributors] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      shopName: 'Blue Water Solutions',
      contact: '+91 98765 43210',
      address: '123 MG Road, Jaipur',
      pincode: '302001',
      area: 'C-Scheme'
    },
    {
      id: 2,
      name: 'Amit Sharma',
      shopName: 'Fresh Aqua Mart',
      contact: '+91 98765 43211',
      address: '456 Malviya Nagar, Jaipur',
      pincode: '302017',
      area: 'Malviya Nagar'
    },
    {
      id: 3,
      name: 'Priya Singh',
      shopName: 'Pure Drop Distributors',
      contact: '+91 98765 43212',
      address: '789 Vaishali Nagar, Jaipur',
      pincode: '302021',
      area: 'Vaishali Nagar'
    },
    {
      id: 4,
      name: 'Vikram Mehta',
      shopName: 'Hydration Hub',
      contact: '+91 98765 43213',
      address: '321 Mansarovar, Jaipur',
      pincode: '302020',
      area: 'Mansarovar'
    }
  ]);

  const handleSearch = () => {
    if (pincode.trim()) {
      setIsSearching(true);
      setShowResults(false);
      
      // Simulate search delay with loading animation
      setTimeout(() => {
        const results = distributors.filter(dist => 
          dist.pincode.includes(pincode) || 
          dist.area.toLowerCase().includes(pincode.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
        setShowResults(true);
      }, 2500); // 2.5 seconds delay for loading animation
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b">
      {/* Moving Tagline Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden relative" style={{ height: '32px' }}>
        <div className="absolute whitespace-nowrap animate-marquee flex items-center h-full">
          <span className="text-sm font-medium px-4">
            🏪 Find our distributors near you for fast and reliable delivery
          </span>
          <span className="text-sm font-medium px-4">
            🏪 Find our distributors near you for fast and reliable delivery
          </span>
          <span className="text-sm font-medium px-4">
            🏪 Find our distributors near you for fast and reliable delivery
          </span>
        </div>
      </div>

      {/* Hero Section with Image */}
      <div className="relative h-100 sm:h-[28rem] md:h-[32rem] lg:h-[36rem] xl:h-[40rem] overflow-hidden">
        <img 
          src={distributor}
          alt="Blue Sip Water Bottles"
className="w-full h-full 
object-contain sm:object-cover 
transform scale-100 sm:scale-110 md:scale-105 lg:scale-100 
transition-transform duration-300"
        />

        <div className="absolute inset-0 bg-gradient-to-r"></div>

        <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-14 md:h-20 bg-white rounded-t-3xl"></div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-blue-600 mb-3 sm:mb-4">
              <Store className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">Authorized Dealers</h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">
              All our distributors are verified and authorized to sell genuine Blue Sip products
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-blue-600 mb-3 sm:mb-4">
              <MapPin className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">Nationwide Coverage</h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">
              Find distributors across major cities and towns throughout the country
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-blue-600 mb-3 sm:mb-4">
              <Phone className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">Direct Contact</h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">
              Get contact details to reach out directly and check product availability
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
            Find Distributors Near You
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your pincode or area"
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 md:py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base md:text-lg"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 md:py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-sm sm:text-base md:text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Loading Animation */}
        {isSearching && (
          <div className="mb-6 sm:mb-8 md:mb-12">
            <div className="bg-white p-8 sm:p-12 md:p-16 rounded-xl shadow-lg">
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  {/* Outer spinning circle */}
                  <div className="animate-spin rounded-full h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 border-t-4 border-b-4 border-blue-600"></div>
                  {/* Inner pulsing circle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="animate-pulse rounded-full h-12 w-12 sm:h-14 sm:w-14 md:h-20 md:w-20 bg-blue-100 flex items-center justify-center">
                      <MapPin className="h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 text-blue-600" />
                    </div>
                  </div>
                </div>
                <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl font-semibold text-gray-700 animate-pulse">
                  Searching for distributors near you...
                </p>
                <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-500">
                  Please wait while we find the best options
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Distributor Results */}
        {showResults && !isSearching && (
          <div className="animate-fadeIn">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
              {searchResults.length > 0 
                ? `Found ${searchResults.length} distributor${searchResults.length > 1 ? 's' : ''} near you`
                : 'No distributors found in your area'}
            </h3>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {searchResults.map((dist, index) => (
                  <div 
                    key={dist.id} 
                    className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-400 animate-slideUp"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                        <Store className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-600" />
                      </div>
                      <span className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                        {dist.pincode}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1 sm:mb-2">{dist.shopName}</h4>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center text-gray-600 text-xs sm:text-sm md:text-base">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                        <span className="break-words font-medium">{dist.name}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-xs sm:text-sm md:text-base">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                        <a href={`tel:${dist.contact}`} className="break-all hover:text-blue-600 transition-colors">
                          {dist.contact}
                        </a>
                      </div>
                      <div className="flex items-start text-gray-600 text-xs sm:text-sm md:text-base">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 mt-1 flex-shrink-0" />
                        <span className="break-words">{dist.address}, {dist.area}</span>
                      </div>
                    </div>
                    <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm">
                      Contact Distributor
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 sm:p-8 text-center animate-fadeIn">
                <div className="flex justify-center mb-4">
                  <div className="bg-yellow-100 p-4 rounded-full">
                    <MapPin className="w-12 h-12 text-yellow-600" />
                  </div>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-2 font-semibold">
                  No distributors found in your area
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Please try a different pincode or contact us for assistance.
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  You can browse all available distributors below or call us at +91 98765 43210
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}