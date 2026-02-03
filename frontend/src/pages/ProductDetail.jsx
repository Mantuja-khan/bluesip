import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { ShoppingCart, ArrowLeft, Star, Zap, AlertCircle, Edit2, Trash2, X } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const BOTTLES_PER_BOX = 12
const MINIMUM_BOXES = 30
const MINIMUM_BOTTLES = MINIMUM_BOXES * BOTTLES_PER_BOX // 360 bottles

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, getActualPrice } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(MINIMUM_BOTTLES)
  const [isWholesale, setIsWholesale] = useState(false)
  const [buyNowLoading, setBuyNowLoading] = useState(false)
  
  // Review states
  const [reviews, setReviews] = useState([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [editingReview, setEditingReview] = useState(null)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  
  const reviewsScrollRef = useRef(null)

  useEffect(() => {
    fetchProduct()
    fetchReviews()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`)
      setProduct(response.data.product)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Product not found')
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}/reviews`)
      setReviews(response.data.reviews || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
      // If endpoint doesn't exist, set empty array
      setReviews([])
    }
  }

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please login to submit a review')
      navigate('/login')
      return
    }

    if (!reviewText.trim()) {
      toast.error('Please write a review')
      return
    }

    setReviewsLoading(true)
    try {
      if (editingReview) {
        // Update existing review
        const response = await axios.put(
          `${API_URL}/products/${id}/reviews/${editingReview._id}`,
          {
            rating: reviewRating,
            comment: reviewText
          },
          {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }
        )
        
        setReviews(reviews.map(review => 
          review._id === editingReview._id ? response.data.review : review
        ))
        toast.success('Review updated successfully!')
      } else {
        // Create new review
        const response = await axios.post(
          `${API_URL}/products/${id}/reviews`,
          {
            rating: reviewRating,
            comment: reviewText
          },
          {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }
        )
        
        setReviews([response.data.review, ...reviews])
        toast.success('Review submitted successfully!')
      }
      
      // Reset form
      setShowReviewModal(false)
      setReviewText('')
      setReviewRating(5)
      setEditingReview(null)
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      await axios.delete(
        `${API_URL}/products/${id}/reviews/${reviewId}`,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      )
      
      setReviews(reviews.filter(review => review._id !== reviewId))
      toast.success('Review deleted successfully!')
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error(error.response?.data?.message || 'Failed to delete review')
    }
  }

  const handleEditReview = (review) => {
    setEditingReview(review)
    setReviewText(review.comment)
    setReviewRating(review.rating)
    setShowReviewModal(true)
  }

  const closeReviewModal = () => {
    setShowReviewModal(false)
    setReviewText('')
    setReviewRating(5)
    setEditingReview(null)
  }

  const handleAddToCart = () => {
    if (!validateMinimumOrder()) {
      toast.error(`Minimum order is ${MINIMUM_BOXES} boxes (${MINIMUM_BOTTLES} bottles)`)
      return
    }

    if (product && product.stock > 0) {
      addToCart(product, quantity, isWholesale)
      toast.success(`${quantity} bottles (${getBoxCount()} boxes) added to cart!`)
    } else {
      toast.error('Product is out of stock')
    }
  }

  const handleBuyNow = async () => {
    if (!validateMinimumOrder()) {
      toast.error(`Minimum order is ${MINIMUM_BOXES} boxes (${MINIMUM_BOTTLES} bottles)`)
      return
    }

    if (!user) {
      toast.error('Please login to place an order')
      navigate('/login')
      return
    }

    if (!product || product.stock < quantity) {
      toast.error('Insufficient stock')
      return
    }

    setBuyNowLoading(true)
    try {
      const currentPrice = getCurrentPrice()
      
      const orderData = {
        items: [{
          product: product._id,
          quantity,
          price: currentPrice,
          isWholesale
        }],
        shippingAddress: {
          fullName: user.name,
          address: user.address || '',
          city: '',
          state: '',
          zipCode: '',
          country: 'India',
          phone: user.phone || ''
        },
        paymentMethod: 'razorpay',
        subtotal: currentPrice * quantity,
        tax: 0,
        total: currentPrice * quantity,
        orderType: isWholesale ? 'wholesale' : 'regular'
      }

      const response = await axios.post(`${API_URL}/orders`, orderData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })

      navigate('/checkout', { 
        state: { 
          orderId: response.data.order._id,
          buyNow: true 
        } 
      })
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error(error.response?.data?.message || 'Failed to create order')
    } finally {
      setBuyNowLoading(false)
    }
  }

  const handleWholesaleToggle = (wholesale) => {
    setIsWholesale(wholesale)
    if (wholesale && quantity < product.minWholesaleQuantity) {
      setQuantity(Math.max(product.minWholesaleQuantity, MINIMUM_BOTTLES))
    }
  }

  const validateMinimumOrder = () => {
    return quantity >= MINIMUM_BOTTLES
  }

  const getBoxCount = () => {
    return Math.floor(quantity / BOTTLES_PER_BOX)
  }

  const getRemainingBottles = () => {
    return quantity % BOTTLES_PER_BOX
  }

  const getCurrentPrice = () => {
    if (isWholesale) {
      return product.wholesaleDiscountedPrice || product.finalWholesalePrice || product.wholesalePrice
    }
    return product.discountedPrice || product.finalPrice || product.price
  }

  const getOriginalPrice = () => {
    if (isWholesale) {
      return product.wholesalePrice
    }
    return product.price
  }

  const getDiscount = () => {
    if (isWholesale) {
      return product.wholesaleDiscount || 0
    }
    return product.discount || 0
  }

  const getMinQuantity = () => {
    return Math.max(isWholesale ? product.minWholesaleQuantity : 1, MINIMUM_BOTTLES)
  }

  const incrementQuantity = () => {
    setQuantity(Math.min(product.stock, quantity + BOTTLES_PER_BOX))
  }

  const decrementQuantity = () => {
    setQuantity(Math.max(MINIMUM_BOTTLES, quantity - BOTTLES_PER_BOX))
  }

  const scrollReviews = (direction) => {
    if (reviewsScrollRef.current) {
      const scrollAmount = 320
      reviewsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const getAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const hasDiscount = getDiscount() > 0
  const originalPrice = getOriginalPrice()
  const currentPrice = getCurrentPrice()
  const isMinimumOrderMet = validateMinimumOrder()

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-8">
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

      {/* Back Button */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Left Column - Product Image */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="bg-white border rounded-lg overflow-hidden relative max-w-md mx-auto">
              <div className="relative w-full" style={{ paddingBottom: '80%' }}>
                <img
                  src={product.image || 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=600'}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-contain p-3"
                />
              </div>
              {hasDiscount && (
                <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">
                  {getDiscount()}% OFF
                </div>
              )}
            </div>

            {/* Minimum Order Warning - Desktop */}
            <div className="hidden lg:block mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-semibold mb-1">Minimum Order Requirement</p>
                  <p>You must order at least <strong>{MINIMUM_BOXES} boxes ({MINIMUM_BOTTLES} bottles)</strong> per order.</p>
                </div>
              </div>
            </div>

            {/* Action Buttons - Desktop Only */}
            <div className="hidden lg:flex gap-3 mt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || !isMinimumOrderMet}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                ADD TO CART
              </button>
              {/* <button
                onClick={handleBuyNow}
                disabled={product.stock === 0 || !isMinimumOrderMet || buyNowLoading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Zap className="h-5 w-5" />
                {buyNowLoading ? 'PROCESSING...' : 'BUY NOW'}
              </button> */}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-4">
            {/* Product Title */}
            <div>
              <h1 className="text-xl lg:text-2xl font-medium text-gray-800 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded">
                <span className="font-semibold">{getAverageRating()}</span>
                <Star className="h-3 w-3 fill-current" />
              </div>
              <span className="text-gray-600">{reviews.length} Ratings & Reviews</span>
            </div>

            {/* Stock Status */}
            <div>
              <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                product.stock > 0 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Minimum Order Warning - Mobile */}
            <div className="lg:hidden bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-semibold mb-1">Minimum Order Requirement</p>
                  <p>You must order at least <strong>{MINIMUM_BOXES} boxes ({MINIMUM_BOTTLES} bottles)</strong> per order.</p>
                </div>
              </div>
            </div>

            {/* Wholesale/Retail Toggle */}
            {product.isWholesale && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Select Purchase Type</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleWholesaleToggle(false)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      !isWholesale 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-xs text-gray-600 mb-1">Retail Price</p>
                      <p className="text-lg font-bold text-gray-900">
                        ₹{product.discountedPrice || product.finalPrice || product.price}
                      </p>
                      <p className="text-xs text-gray-500">Per piece</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleWholesaleToggle(true)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isWholesale 
                        ? 'border-orange-600 bg-orange-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-xs text-gray-600 mb-1">Wholesale Price</p>
                      <p className="text-lg font-bold text-gray-900">
                        ₹{product.wholesaleDiscountedPrice || product.finalWholesalePrice || product.wholesalePrice}
                      </p>
                      <p className="text-xs text-gray-500">Min {product.minWholesaleQuantity} pcs</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Price Section */}
            <div className="border-t border-b py-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-3xl font-semibold text-gray-900">
                  ₹{currentPrice}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{originalPrice}
                    </span>
                    <span className="text-green-600 font-semibold text-lg">
                      {getDiscount()}% off
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">Price per bottle</p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={decrementQuantity}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors font-semibold text-gray-700"
                    disabled={quantity <= MINIMUM_BOTTLES}
                  >
                    −
                  </button>
                  <span className="px-6 py-2 border-x border-gray-300 min-w-[80px] text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors font-semibold text-gray-700"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Box Calculation Display */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-blue-900">
                      {getBoxCount()} Boxes {getRemainingBottles() > 0 && `+ ${getRemainingBottles()} bottles`}
                    </p>
                    <p className="text-blue-700 text-xs mt-1">
                      ({BOTTLES_PER_BOX} bottles per box)
                    </p>
                  </div>
                  {!isMinimumOrderMet && (
                    <span className="text-red-600 text-xs font-medium">
                      Min: {MINIMUM_BOXES} boxes
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total Amount:</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{(currentPrice * quantity).toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1 text-right">
                {quantity} bottles × ₹{currentPrice}
              </p>
            </div>

            {/* Product Details */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Size</span>
                  <span className="font-medium text-gray-900">{product.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Material</span>
                  <span className="font-medium text-gray-900">Good Plastic</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-medium text-gray-900">1-KG</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Insulation</span>
                  <span className="font-medium text-gray-900">Long Term</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Packaging</span>
                  <span className="font-medium text-gray-900">{BOTTLES_PER_BOX} bottles per box</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Customer Reviews Section */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Customer Reviews ({reviews.length})</h3>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
                >
                  Write Review
                </button>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Scroll buttons for many reviews */}
                  {reviews.length > 2 && (
                    <>
                      <button
                        onClick={() => scrollReviews('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition-colors"
                        style={{ marginLeft: '-16px' }}
                      >
                        <ArrowLeft className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        onClick={() => scrollReviews('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition-colors"
                        style={{ marginRight: '-16px' }}
                      >
                        <ArrowLeft className="h-5 w-5 text-gray-700 rotate-180" />
                      </button>
                    </>
                  )}

                  {/* Reviews scrollable container */}
                  <div
                    ref={reviewsScrollRef}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="flex-shrink-0 w-[300px] bg-gray-50 rounded-lg p-4 snap-start"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {user && review.user && review.user._id === user._id && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditReview(review)}
                                className="text-blue-600 hover:text-blue-700 transition-colors"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review._id)}
                                className="text-red-600 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="font-medium text-sm text-gray-900 mb-1">
                          {review.user?.name || 'Anonymous'}
                        </p>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {review.comment}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 z-20">
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || !isMinimumOrderMet}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-sm">ADD TO CART</span>
          </button>
          <button
            onClick={handleBuyNow}
            disabled={product.stock === 0 || !isMinimumOrderMet || buyNowLoading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Zap className="h-5 w-5" />
            <span className="text-sm">{buyNowLoading ? 'PROCESSING...' : 'BUY NOW'}</span>
          </button>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingReview ? 'Edit Review' : 'Write a Review'}
              </h3>
              <button
                onClick={closeReviewModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Rating Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setReviewRating(rating)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        rating <= reviewRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows="4"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Share your experience with this product..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeReviewModal}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={reviewsLoading || !reviewText.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reviewsLoading ? 'Submitting...' : editingReview ? 'Update' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Styles */}
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

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default ProductDetail