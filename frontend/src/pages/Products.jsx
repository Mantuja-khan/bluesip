import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { Filter, Grid, List, ShoppingCart, Search } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'
import wholesale from '../assets/wholesale.png'

const API_URL = 'http://localhost:5000/api'

const BOTTLES_PER_BOX = 12
const MINIMUM_BOXES = 30
const MINIMUM_BOTTLES = MINIMUM_BOXES * BOTTLES_PER_BOX // 360 bottles

const Products = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState('grid')
  const { addToCart, getActualPrice } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, priceRange, sortBy])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`)
      setProducts(response.data.products)
      setFilteredProducts(response.data.products)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Price filter - use actual price
    filtered = filtered.filter(product => {
      const price = product.discountedPrice || product.finalPrice || product.price
      return price >= priceRange.min && price <= priceRange.max
    })

    // Sort
    filtered.sort((a, b) => {
      const priceA = a.discountedPrice || a.finalPrice || a.price
      const priceB = b.discountedPrice || b.finalPrice || b.price
      
      switch (sortBy) {
        case 'price-low':
          return priceA - priceB
        case 'price-high':
          return priceB - priceA
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart(product)
      toast.success(`${product.name} added to cart!`)
    } else {
      toast.error('Product is out of stock')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20 lg:pb-8">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 border-b-2 border-blue-sip-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Moving Tagline Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white overflow-hidden relative" style={{ height: '32px' }}>
        <div className="absolute whitespace-nowrap animate-marquee flex items-center h-full">
          <span className="text-sm font-medium px-4">
            ⚠️ You must order a minimum of {MINIMUM_BOXES} boxes in a single order. Each box contains {BOTTLES_PER_BOX} bottles (Total: {MINIMUM_BOTTLES} bottles minimum)
          </span>
          <span className="text-sm font-medium px-4">
            ⚠️ You must order a minimum of {MINIMUM_BOXES} boxes in a single order. Each box contains {BOTTLES_PER_BOX} bottles (Total: {MINIMUM_BOTTLES} bottles minimum)
          </span>
          <span className="text-sm font-medium px-4">
            ⚠️ You must order a minimum of {MINIMUM_BOXES} boxes in a single order. Each box contains {BOTTLES_PER_BOX} bottles (Total: {MINIMUM_BOTTLES} bottles minimum)
          </span>
        </div>
      </div>

      <div className="py-4 sm:py-6 md:py-8 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Our Water Bottles</h1>
            <p className="text-gray-600 text-sm sm:text-base">Discover our range of premium hydration solutions</p>
          </div>

          {/* Filters and Search */}
          <div className="rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Price Range */}
              <div>
                <select
                  value={`${priceRange.min}-${priceRange.max}`}
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-').map(Number)
                    setPriceRange({ min, max })
                  }}
                  className="input-field text-sm sm:text-base"
                >
                  <option value="0-10000">All Prices</option>
                  <option value="0-500">Under ₹500</option>
                  <option value="500-1000">₹500 - ₹1000</option>
                  <option value="1000-2000">₹1000 - ₹2000</option>
                  <option value="2000-10000">Over ₹2000</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field text-sm sm:text-base"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* Search */}
              <div className="relative col-span-2 sm:col-span-2 lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
                <input
                  type="text"
                  placeholder="Search water bottles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 sm:pl-10 input-field text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 sm:mb-6">
            <p className="text-gray-600 text-sm sm:text-base">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-3 sm:gap-4 md:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => {
              const actualPrice = product.discountedPrice || product.finalPrice || product.price
              const originalPrice = product.price
              const hasDiscount = product.discount > 0
              
              return (
                <div key={product._id} className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${viewMode === 'list' ? 'flex' : ''}`}>
                  <div className={`relative ${viewMode === 'list' ? 'w-32 sm:w-48 flex-shrink-0' : ''}`}>
                    <div className={`${
                      viewMode === 'list' 
                        ? 'w-32 sm:w-48 h-32 sm:h-48' 
                        : 'w-full h-40 sm:h-56 md:h-64'
                    } overflow-hidden bg-gray-100 flex items-center justify-center`}>
                      <img
                        src={product.image || 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={product.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    {hasDiscount && (
                      <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-red-500 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium">
                        {product.discount}% off
                      </div>
                    )}
                    {product.isWholesale && (
                      <div className="absolute top-1 sm:top-2 right-1 sm:right-2 p-1 rounded-md">
                        <img 
                          src={wholesale} 
                          alt="Wholesale"
                          className="w-4 h-4 sm:w-5 sm:h-5"
                        />
                      </div>
                    )}
                    {!product.isWholesale && product.stock <= 5 && product.stock > 0 && (
                      <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-orange-500 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs">
                        Only {product.stock} left
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-medium text-xs sm:text-sm">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  <div className="p-2 sm:p-3 md:p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1 sm:mb-2">
                      <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 line-clamp-2 flex-1 pr-1 sm:pr-2">
                        {product.name}
                      </h3>
                      <span className={`px-1 sm:px-2 py-0.5 text-xs rounded-full whitespace-nowrap ${
                        product.stock > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? 'In Stock' : 'Out'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mb-1.5 sm:mb-2 md:mb-3">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <span className="text-sm sm:text-base md:text-lg font-bold text-blue-sip-600">
                          ₹{actualPrice}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs sm:text-sm text-gray-500 line-through">
                            ₹{originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {product.size}
                      </span>
                    </div>
                    
                    {product.isWholesale && (
                      <div className="mb-1.5 sm:mb-2 md:mb-3 p-1 sm:p-2 bg-orange-50 rounded-md hidden sm:block">
                        <p className="text-xs text-orange-800">
                          Wholesale: ₹{product.wholesalePrice} (Min {product.minWholesaleQuantity})
                        </p>
                      </div>
                    )}

                    <div className="flex flex-row space-x-1.5 sm:space-x-2 mt-auto">
                      <Link
                        to={`/product/${product._id}`}
                        className="flex-1 text-center py-1 sm:py-1.5 md:py-2 px-1.5 sm:px-2 md:px-3 border border-blue-sip-600 text-blue-sip-600 rounded-md hover:bg-blue-sip-50 transition-colors text-xs sm:text-sm font-medium"
                      >
                        View
                      </Link>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="flex-1 bg-blue-sip-600 text-white py-1 sm:py-1.5 md:py-2 px-1.5 sm:px-2 md:px-3 rounded-md hover:bg-blue-sip-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm font-medium flex items-center justify-center space-x-1"
                      >
                        <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">
                          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </span>
                        <span className="sm:hidden">
                          {product.stock === 0 ? "Out" : "Add"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-base sm:text-lg">No water bottles found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* CSS for marquee animation */}
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
      `}</style>
    </div>
  )
}

export default Products