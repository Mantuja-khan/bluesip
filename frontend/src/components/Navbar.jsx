import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import bluesiplogo from "../assets/bluesiplogo.png"
import { Droplets, ShoppingCart, User, Menu, X, LogOut, Package, UserCircle, Info, MessageCircle, MapPin, CheckCircle, XCircle, Briefcase } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { getCartItemsCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true)
  const [isTopNavVisible, setIsTopNavVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isChecking, setIsChecking] = useState(false)

  
  // Location Modal States
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [cityName, setCityName] = useState('')
  const [pincode, setPincode] = useState('')
  const [availabilityStatus, setAvailabilityStatus] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)

  // Available Cities and Pincodes
  const availableLocations = [
    {
      city: 'Nuh',
      pincodes: ['122103', '122104', '122105', '122107', '122108', '122508']
    },
    {
      city: 'Gurugram',
      pincodes: [
        '122001', '122002', '122003', '122004',
        '122005', '122006', '122007', '122008',
        '122009', '122010', '122011', '122015',
        '122016', '122017', '122018', '122051',
        '122052', '122101', '122102'
      ]
    },
    {
      city: 'Tauru',
      pincodes: ['122105']
    },
    {
      city: 'Palwal',
      pincodes: ['121102', '121105', '121106', '121107', '121108', '121109']
    },
    {
      city: 'Delhi',
      pincodes: [
        '110001', '110002', '110003', '110005',
        '110016', '110018', '110021', '110024',
        '110033', '110043'
      ]
    },
    {
      city: 'Bhiwadi',
      pincodes: ['301019']
    },
    {
      city: 'Hyderabad',
      pincodes: ['500001', '500003', '500016', '500081']
    },
    {
      city: 'Pune',
      pincodes: ['411001', '411002', '411014', '411038']
    }
  ];

  // Check if location modal should be shown on first visit
  useEffect(() => {
    const hasSeenLocationModal = localStorage.getItem('hasSeenLocationModal')
    const savedLocation = localStorage.getItem('selectedLocation')
    
    if (savedLocation) {
      setSelectedLocation(JSON.parse(savedLocation))
    } else if (!hasSeenLocationModal) {
      setTimeout(() => {
        setShowLocationModal(true)
        localStorage.setItem('hasSeenLocationModal', 'true')
      }, 1000)
    }
  }, [])

  const checkAvailability = () => {
    if (!cityName && !pincode) {
      setAvailabilityStatus({
        available: false,
        message: 'Please enter city or pincode'
      })
      return
    }

    setIsChecking(true)
    setAvailabilityStatus(null) // Clear previous status

    setTimeout(() => {
      let isAvailable = false
      let matchedLocation = null

      // City Match
      if (cityName) {
        matchedLocation = availableLocations.find(
          loc => loc.city.toLowerCase() === cityName.toLowerCase()
        )
        if (matchedLocation) isAvailable = true
      }

      // Pincode Match
      if (pincode && !isAvailable) {
        matchedLocation = availableLocations.find(
          loc => loc.pincodes.includes(pincode)
        )
        if (matchedLocation) isAvailable = true
      }

      if (isAvailable && matchedLocation) {
        const locationData = {
          city: matchedLocation.city,
          pincode: pincode || matchedLocation.pincodes[0],
          available: true
        }

        setAvailabilityStatus({
          available: true,
          message: `🎉 Great! We deliver to ${locationData.city} (${locationData.pincode})`
        })

        // Update location in state and localStorage
        localStorage.setItem('selectedLocation', JSON.stringify(locationData))
        setSelectedLocation(locationData)

        // Auto close modal after 2 seconds
        setTimeout(() => {
          closeLocationModal()
        }, 2000)

      } else {
        setAvailabilityStatus({
          available: false,
          message: '❌ Sorry! We don\'t deliver to this area yet.'
        })

        // Auto close modal after 3 seconds for unavailable locations
        setTimeout(() => {
          closeLocationModal()
        }, 3000)
      }

      setIsChecking(false)
    }, 2000)
  }

  const closeLocationModal = () => {
    setShowLocationModal(false)
    // Reset form after animation completes
    setTimeout(() => {
      setCityName('')
      setPincode('')
      setAvailabilityStatus(null)
    }, 300)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsUserMenuOpen(false)
    setIsMenuOpen(false)
  }

  const cartItemsCount = getCartItemsCount()

  const closeMenus = () => {
    setIsMenuOpen(false)
    setIsUserMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  // Handle scroll for both top and bottom navigation visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsTopNavVisible(false)
        setIsBottomNavVisible(false)
      } else {
        setIsTopNavVisible(true)
        setIsBottomNavVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsBottomNavVisible(true)
        setIsTopNavVisible(true)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Get button color based on availability
  const getLocationButtonColor = () => {
    if (!selectedLocation) return 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    return selectedLocation.available 
      ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' 
      : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
  }

  const getLocationIcon = () => {
    if (!selectedLocation) return <MapPin className="h-4 w-4 text-gray-600" />
    return selectedLocation.available 
      ? <CheckCircle className="h-4 w-4 text-green-600" />
      : <XCircle className="h-4 w-4 text-red-600" />
  }

  return (
    <>
      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-slideUp">
            {/* Close Button */}
            <button
              onClick={closeLocationModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors hover:rotate-90 transform duration-200"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce-slow">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Check Delivery
              </h2>
              <p className="text-gray-600 text-sm">
                Enter your city or pincode to check availability
              </p>
            </div>

            {/* Input Fields */}
            <div className="space-y-3 mb-4">
              <div>
                <input
                  type="text"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  placeholder="City Name (e.g., Gurugram)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300"
                  disabled={isChecking}
                />
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              <div>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Pincode (e.g., 122001)"
                  maxLength="6"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300"
                  disabled={isChecking}
                />
              </div>
            </div>

            {/* Check Button */}
            <button
              onClick={checkAvailability}
              disabled={isChecking}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg   hover:from-blue-600 hover:to-blue-700 transition-all mb-4 flex justify-center items-center shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isChecking ? (
                <>
                  <div className="relative h-5 w-5 mr-3">
                    <div className="absolute top-0 left-0 h-5 w-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute top-0 left-0 h-5 w-5 border-2 border-white/30 rounded-full"></div>
                  </div>
                  Checking Availability...
                </>
              ) : (
                <>
                  <MapPin className="h-5 w-5 mr-2" />
                  Check Availability
                </>
              )}
            </button>

            {/* Availability Status */}
            {availabilityStatus && (
              <div className={`p-4 rounded-lg text-center   animate-slideDown ${
                availabilityStatus.available 
                  ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-2 border-green-300 shadow-sm' 
                  : 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-2 border-red-300 shadow-sm'
              }`}>
                <div className="flex items-center justify-center space-x-2">
                  {availabilityStatus.available ? (
                    <CheckCircle className="h-5 w-5 animate-bounce-once" />
                  ) : (
                    <XCircle className="h-5 w-5 animate-shake" />
                  )}
                  <span>{availabilityStatus.message}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop & Tablet Navbar */}
      <nav className={`shadow-lg sticky top-0 z-50 block transition-transform duration-300 bg-white ${
        isTopNavVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center"
              onClick={closeMenus}
            >
              <img
                src={bluesiplogo}
                alt="Blue Sip Logo"
                className="h-40 sm:h-40 lg:h-40 xl:h-40 w-40"
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <Link 
                to="/" 
                className={`text-sm xl:text-base transition-colors   ${
                  isActive('/') 
                    ? 'text-green-600 border-b-2 border-green-600 pb-1' 
                    : 'text-black hover:text-green-600'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className={`text-sm xl:text-base transition-colors  ${
                  isActive('/products') 
                    ? 'text-green-600 border-b-2 border-green-600 pb-1' 
                    : 'text-black hover:text-green-600'
                }`}
              >
                Products
              </Link>
              <Link 
                to="/about" 
                className={`text-sm xl:text-base transition-colors   ${
                  isActive('/about') 
                    ? 'text-green-600 border-b-2 border-green-600 pb-1' 
                    : 'text-black hover:text-green-600'
                }`}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className={`text-sm xl:text-base transition-colors   ${
                  isActive('/contact') 
                    ? 'text-green-600 border-b-2 border-green-600 pb-1' 
                    : 'text-black hover:text-green-600'
                }`}
              >
                Contact
              </Link>
              <Link 
                to="/customize" 
                className={`text-sm xl:text-base transition-colors   ${
                  isActive('/customize')
                    ? 'text-green-600 border-b-2 border-green-600 pb-1' 
                    : 'text-black hover:text-green-600'
                }`}
              >
                Customize Sticker
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Location Button - Desktop & Tablet */}
              <button
                onClick={() => setShowLocationModal(true)}
                className={`hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg transition-all transform hover:scale-105 active:scale-95 ${getLocationButtonColor()}`}
              >
                {getLocationIcon()}
                <span className="text-xs  ">
                  {selectedLocation ? selectedLocation.city : 'Select Location'}
                </span>
              </button>

              {/* Location Button - Mobile Only */}
              <button
                onClick={() => setShowLocationModal(true)}
                className={`sm:hidden flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition-all transform hover:scale-105 active:scale-95 ${getLocationButtonColor()}`}
              >
                {getLocationIcon()}
                <span className="text-xs  ">
                  {selectedLocation ? selectedLocation.city : 'Location'}
                </span>
              </button>

              {/* Cart */}
              <Link to="/cart" className="relative p-4 text-black hover:text-gray-700 transition-colors" onClick={closeMenus}>
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                {cartItemsCount > 0 && (
               <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] sm:text-xs font-bold rounded-full min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] flex items-center justify-center px-1 shadow-md animate-pulse translate-y-[1px]">
  {cartItemsCount > 99 ? '99+' : cartItemsCount}
</span>
                )}
              </Link>

              {/* Desktop User Menu */}
              <div className="hidden lg:flex items-center space-x-3">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 text-black hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
                    >
                      <User className="h-5 w-5 xl:h-6 xl:w-6" />
                      <span className="hidden xl:block text-sm  ">{user.name}</span>
                    </button>
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm   text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 font-medium"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <UserCircle className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 font-medium"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package className="h-4 w-4" />
                          <span>My Orders</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 xl:space-x-3">
                    <Link to="/login" className="text-sm xl:text-base text-black hover:text-gray-700 transition-colors  ">
                      Login
                    </Link>
                    <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-xs xl:text-sm px-3 xl:px-4 py-2 rounded-lg transition-colors   shadow-md hover:shadow-lg transform hover:scale-105">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 transition-transform duration-300 ${
        isBottomNavVisible ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="grid grid-cols-5 h-16">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              isActive('/') 
                ? 'text-green-600' 
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <Droplets className="h-5 w-5" />
            <span className="text-xs  ">Home</span>
          </Link>
          
          <Link
            to="/products"
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              isActive('/products') 
                ? 'text-green-600' 
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <Package className="h-5 w-5" />
            <span className="text-xs  ">Products</span>
          </Link>

          <Link
            to="/about"
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              isActive('/about') 
                ? 'text-green-600' 
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <Info className="h-5 w-5" />
            <span className="text-xs  ">About</span>
          </Link>

          <Link
            to="/customize"
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              isActive('/customize') 
                ? 'text-green-600' 
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span className="text-xs  ">Customize</span>
          </Link>

          {/* Menu Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              isMenuOpen 
                ? 'text-green-600' 
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs  ">Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Sheet Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] lg:hidden animate-fadeIn"
            onClick={closeMenus}
          />
          
          {/* Bottom Sheet */}
          <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[70] lg:hidden transform transition-transform duration-300 ease-in-out max-h-[80vh] ${
            isMenuOpen ? 'translate-y-0' : 'translate-y-full'
          }`}>
            <div className="flex flex-col">
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-6 w-6 text-blue-600" />
                  <span className="font-bold text-lg text-gray-900">Menu</span>
                </div>
                <button
                  onClick={closeMenus}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[60vh]">
                {/* User Info */}
                {user && (
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-base   text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Menu Items */}
                <div className="px-4 py-4 space-y-2">
                  {/* Contact Link */}
                  <Link
                    to="/contact"
                    className="flex items-center space-x-3 px-4 py-3 text-base text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors  "
                    onClick={closeMenus}
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Contact Us</span>
                  </Link>

                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-3 text-base text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors  "
                        onClick={closeMenus}
                      >
                        <UserCircle className="h-5 w-5" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center space-x-3 px-4 py-3 text-base text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors  "
                        onClick={closeMenus}
                      >
                        <Package className="h-5 w-5" />
                        <span>My Orders</span>
                      </Link>
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-base text-red-600 hover:bg-red-50 rounded-xl transition-colors  "
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2 pt-2">
                      <Link
                        to="/login"
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-blue-600 hover:bg-blue-50 border-2 border-blue-200 rounded-xl transition-colors  "
                        onClick={closeMenus}
                      >
                        <User className="h-5 w-5" />
                        <span>Login</span>
                      </Link>
                      <Link
                        to="/register"
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors  "
                        onClick={closeMenus}
                      >
                        <UserCircle className="h-5 w-5" />
                        <span>Register</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes bounceOnce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-bounce-slow {
          animation: bounceSlow 2s infinite;
        }

        .animate-bounce-once {
          animation: bounceOnce 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-out;
        }
      `}</style>
    </>
  )
}

export default Navbar