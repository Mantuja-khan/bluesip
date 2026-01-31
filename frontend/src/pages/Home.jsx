import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import {  Shield, Star, ArrowRight, ShoppingCart, Award, Users, Zap, Heart, CheckCircle, Sparkles, TrendingUp, Globe, Thermometer, Recycle, Play, ChevronRight, Clock, Package, Leaf, Target, Gift, Coffee, Sun, Moon } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'
import bluesip from "../assets/bluesip.png"

const API_URL = 'https://api.bluesip.org.in/api'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products?limit=8`)
      setFeaturedProducts(response.data.products)
    } catch (error) {
      console.error('Error fetching featured products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      const productToAdd = {
        ...product,
        price: product.discountedPrice || product.finalPrice || product.price
      }
      addToCart(productToAdd)
      toast.success(`${product.name} added to cart!`)
    } else {
      toast.error('Product is out of stock')
    }
  }

 const features = [
  {
    icon: <Thermometer className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />,
    title: "Long Cooling",
    subtitle: "Fresh All Day",
    description: "Enjoy cool and refreshing water throughout your daily routine",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />,
    title: "Spill Safe",
    subtitle: "Travel Friendly",
    description: "Designed to stay leak-free even while traveling or carrying in bags",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />,
    title: "Eco Smart",
    subtitle: "Planet Friendly",
    description: "Reusable bottle that reduces plastic waste and supports sustainable living",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: <Award className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />,
    title: "Quality Promise",
    subtitle: "Trusted Build",
    description: "Built with premium materials for long-lasting performance",
    gradient: "from-orange-500 to-red-500"
  }
]


  const stats = [
  { number: "Trusted", label: "By Families", icon: <Users className="h-5 w-5" />, color: "text-blue-600" },
  { number: "Long Lasting", label: "Cooling Effect", icon: <Thermometer className="h-5 w-5" />, color: "text-cyan-600" },
  { number: "BPA Free", label: "Safe Material", icon: <Shield className="h-5 w-5" />, color: "text-green-600" },
  { number: "Quality", label: "Guaranteed", icon: <Award className="h-5 w-5" />, color: "text-purple-600" }
]


  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      comment: "Absolutely love my Blue Sip bottle! It keeps my water ice-cold during Mumbai's scorching heat. The quality is outstanding and the design is so elegant!",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
      verified: true,
      product: "750ml Premium"
    },
    {
      name: "Rahul Kumar",
      location: "Delhi",
      rating: 5,
      comment: "Perfect for my gym sessions and office meetings. The leak-proof design gives me complete confidence, and the temperature retention is simply amazing!",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
      verified: true,
      product: "1L Sports Edition"
    },
    {
      name: "Anita Patel",
      location: "Bangalore",
      rating: 5,
      comment: "This bottle has transformed my hydration habits! The eco-friendly design aligns with my values and the insulation technology is incredible. Highly recommended!",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
      verified: true,
      product: "500ml Classic"
    }
  ]

  const benefits = [
    { icon: <Clock className="h-4 w-4" />, text: "All-day temperature retention", color: "text-blue-600" },
    { icon: <Package className="h-4 w-4" />, text: "Free shipping on orders ₹500+", color: "text-green-600" },
    { icon: <Shield className="h-4 w-4" />, text: "2-year comprehensive warranty", color: "text-purple-600" },
    { icon: <Recycle className="h-4 w-4" />, text: "100% sustainable materials", color: "text-orange-600" }
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with Animated Background */}
<section className="relative w-full overflow-hidden min-h-0 lg:min-h-screen pt-0 mt-0">
  {/* Desktop Image */}
  <img
    src={bluesip}
    alt="Blue Sip Water Bottle Desktop"
    className="
      hidden lg:block
      absolute inset-0
      w-full h-full
      object-cover object-center
      scale-99
      lg:-translate-y-22
    "
  />

  {/* Mobile Image */}
 <img
  src={bluesip}
  alt="Blue Sip Water Bottle Mobile"
  className="
    block lg:hidden
    w-full
    h-auto
    object-contain
    mx-auto
    -mt-0
    pt-0
  "
/>
  {/* Overlay (Desktop only) */}
</section>
 {/* Featured Products */}
     <section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-6">
        <TrendingUp className="h-4 w-4 mr-2" />
        Best Sellers
      </div>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
        Premium Collection
      </h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Discover our most popular hydration solutions designed for every lifestyle
      </p>
    </div>

    {loading ? (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    ) : (
      <>
        {/* Scrollable container for small screens */}
        <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex space-x-3" style={{ width: 'max-content' }}>
            {featuredProducts.map((product) => {
              const discountedPrice = product.discountedPrice || product.finalPrice;
              const originalPrice = product.price;
              const hasDiscount = product.discount > 0;
              
              return (
                <div key={product._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200" style={{ width: '240px', flexShrink: 0 }}>
                  <div className="relative overflow-hidden bg-gray-50">
                    <img
                      src={product.image || 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={product.name}
                      className="w-full h-40 object-contain scale-90"
                    />
                    
                    {hasDiscount && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-semibold">
                        {product.discount}% OFF
                      </div>
                    )}
                    
                    {product.stock <= 5 && product.stock > 0 && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-semibold">
                        {product.stock} left
                      </div>
                    )}
                    
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-white font-semibold">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-1.5">
                      <h3 className="text-sm font-semibold text-gray-900 flex-1 mr-2">
                        {product.name}
                      </h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                        {product.size}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-baseline space-x-1.5 mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{discountedPrice || originalPrice}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{originalPrice}
                        </span>
                      )}
                    </div>

                    {product.isWholesale && (
                      <div className="mb-2 p-1.5 bg-orange-50 rounded border border-orange-100">
                        <p className="text-xs text-orange-700 flex items-center">
                          <Gift className="h-3 w-3 mr-1" />
                          Bulk: ₹{product.wholesalePrice} (Min {product.minWholesaleQuantity})
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Link
                        to={`/product/${product._id}`}
                        className="flex-1 text-center py-1.5 px-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-xs font-medium"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="flex-1 bg-blue-600 text-white py-1.5 px-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium flex items-center justify-center space-x-1"
                      >
                        <ShoppingCart className="h-3 w-3" />
                        <span>{product.stock === 0 ? 'Out' : 'Add'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grid layout for larger screens */}
        <div className="hidden lg:grid grid-cols-2 xl:grid-cols-4 gap-5">
          {featuredProducts.map((product) => {
            const discountedPrice = product.discountedPrice || product.finalPrice;
            const originalPrice = product.price;
            const hasDiscount = product.discount > 0;
            
            return (
              <div key={product._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
                <div className="relative overflow-hidden bg-gray-50">
                  <img
                    src={product.image || 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={product.name}
                    className="w-full h-44 object-contain scale-90"
                  />
                  
                  {hasDiscount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-semibold">
                      {product.discount}% OFF
                    </div>
                  )}
                  
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-semibold">
                      {product.stock} left
                    </div>
                  )}
                  
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">Out of Stock</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1.5">
                    <h3 className="text-base font-semibold text-gray-900 flex-1 mr-2">
                      {product.name}
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                      {product.size}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-baseline space-x-1.5 mb-3">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{discountedPrice || originalPrice}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{originalPrice}
                      </span>
                    )}
                  </div>

                  {product.isWholesale && (
                    <div className="mb-3 p-1.5 bg-orange-50 rounded border border-orange-100">
                      <p className="text-xs text-orange-700 flex items-center">
                        <Gift className="h-3 w-3 mr-1" />
                        Bulk: ₹{product.wholesalePrice} (Min {product.minWholesaleQuantity})
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Link
                      to={`/product/${product._id}`}
                      className="flex-1 text-center py-1.5 px-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="flex-1 bg-blue-600 text-white py-1.5 px-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      <span>{product.stock === 0 ? 'Out of Stock' : 'Add'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    )}
    
    <div className="text-center mt-12">
      <Link
        to="/products"
        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
      >
        <span>Explore All Products</span>
        <ArrowRight className="h-5 w-5" />
      </Link>
    </div>
  </div>
</section>
      {/* Features Section */}
    <section className="relative  py-6 overflow-hidden bg-gray-50">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white backdrop-blur-sm rounded-full text-green-700 text-sm font-semibold mb-8 shadow-md border border-green-100 hover:scale-105 transition-transform duration-300">
            <Target className="h-4 w-4" />
            Why Choose Blue Sip
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Engineered for
            <span className="block mt-2 text-green-600">
              Perfect Hydration
            </span>
          </h2>
          
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Every Blue Sip bottle combines cutting-edge technology with sustainable design
            to revolutionize your hydration experience
          </p>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="h-1 w-16 bg-gradient-to-r from-transparent via-green-400 to-transparent rounded-full"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <div className="h-1 w-16 bg-gradient-to-r from-transparent via-green-400 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="relative"
            >
              {/* Card */}
              <div className="relative h-full bg-white backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-md`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  
                  <p className={`text-sm font-semibold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                    {feature.subtitle}
                  </p>
                  
                  <p className="text-gray-700 leading-relaxed text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
     

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-6">
              <Heart className="h-4 w-4 mr-2" />
              Customer Love
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of satisfied customers who've upgraded their hydration
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      {testimonial.verified && (
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          ✓ Verified
                        </div>
                      )}
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {testimonial.product}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 italic leading-relaxed">
                    "{testimonial.comment}"
                  </p>
                  
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-blue-100"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
     <section className="relative py-20 bg-gradient-to-r from-gray-50 via-green-50 to-gray-100 overflow-hidden">
  {/* Background Animation */}
  <div className="absolute inset-0">
    <div className="absolute top-0 left-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
    <div className="absolute top-0 right-0 w-96 h-96 bg-gray-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
  </div>

  <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
    <div className="inline-flex items-center px-4 py-2 bg-gray-800/10 backdrop-blur-sm rounded-full text-gray-700 text-sm font-medium mb-8">
      <Zap className="h-4 w-4 mr-2 text-green-600" />
      Start Your Hydration Journey
    </div>
    
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
      Ready to Transform Your
      <span className="block bg-gradient-to-r from-green-500 via-green-400 to-green-600 bg-clip-text text-transparent">
        Hydration Experience?
      </span>
    </h2>
    
    <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
      Join thousands of satisfied customers and experience premium hydration today. 
      Free shipping on orders over ₹500 across India!
    </p>
    
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        to="/products"
        className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
      >
        <span className="flex items-center justify-center space-x-2">
          <ShoppingCart className="h-5 w-5" />
          <span>Shop Water Bottles</span>
        </span>
      </Link>
      
      <Link
        to="/contact"
        className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-full border border-gray-300 hover:bg-white transition-all duration-300"
      >
        Contact Us
      </Link>
    </div>
  </div>
</section>
    </div>
  )
}
export default Home