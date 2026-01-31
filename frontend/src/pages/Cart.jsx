import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart, getActualPrice } = useCart()

  // Constants for minimum order
  const BOTTLES_PER_BOX = 12
  const MINIMUM_BOXES = 30
  const MINIMUM_BOTTLES = MINIMUM_BOXES * BOTTLES_PER_BOX // 360 bottles

  // Calculate total bottles in cart
  const getTotalBottles = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  // Calculate total boxes
  const getTotalBoxes = () => {
    const totalBottles = getTotalBottles()
    return Math.floor(totalBottles / BOTTLES_PER_BOX)
  }

  // Check if minimum order is met
  const isMinimumOrderMet = () => {
    return getTotalBottles() >= MINIMUM_BOTTLES
  }

  // Calculate remaining bottles needed
  const getRemainingBottles = () => {
    const totalBottles = getTotalBottles()
    return totalBottles < MINIMUM_BOTTLES ? MINIMUM_BOTTLES - totalBottles : 0
  }

  const handleUpdateQuantity = (productId, newQuantity, isWholesale = false) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, isWholesale)
      toast.success('Item removed from cart')
    } else {
      updateQuantity(productId, newQuantity, isWholesale)
    }
  }

  const handleRemoveItem = (productId, productName, isWholesale = false) => {
    removeFromCart(productId, isWholesale)
    toast.success(`${productName} removed from cart`)
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart()
      toast.success('Cart cleared')
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 text-gray-400 mb-3 sm:mb-4 md:mb-6" />
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">Your cart is empty</h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-6 md:mb-8">
              Looks like you haven't added any water bottles to your cart yet.
            </p>
            <Link to="/products" className="btn-primary text-xs sm:text-sm md:text-base">
              Shop Water Bottles
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = getCartTotal()
  const total = subtotal // No GST or additional charges
  const totalBottles = getTotalBottles()
  const totalBoxes = getTotalBoxes()
  const remainingBottles = getRemainingBottles()
  const minimumMet = isMinimumOrderMet()

  return (
    <div className="min-h-screen bg-gray-50 py-2 sm:py-4 md:py-6 lg:py-8 pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 lg:mb-8">Shopping Cart</h1>

        {/* Minimum Order Warning */}
        {!minimumMet && (
          <div className="mb-4 sm:mb-6 bg-orange-50 border-l-4 border-orange-400 p-3 sm:p-4 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="ml-3 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-orange-800">
                  Minimum Order Required
                </h3>
                <div className="mt-2 text-xs sm:text-sm text-orange-700">
                  <p className="mb-1">
                    Minimum order: <strong>{MINIMUM_BOXES} boxes ({MINIMUM_BOTTLES} bottles)</strong>
                  </p>
                  <p className="mb-1">
                    Current order: <strong>{totalBoxes} boxes ({totalBottles} bottles)</strong>
                  </p>
                  <p className="font-semibold text-orange-900">
                    Please add <strong>{remainingBottles} more bottles</strong> ({Math.ceil(remainingBottles / BOTTLES_PER_BOX)} boxes) to proceed to checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 md:py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900">
                  Cart Items ({cartItems.length})
                </h3>
                <button
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => {
                  const actualPrice = getActualPrice(item)
                  return (
                    <div key={`${item._id}-${item.isWholesale}`} className="p-2 sm:p-3 md:p-4 lg:p-6">
                      <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4">
                        <img
                          src={item.image || 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=150'}
                          alt={item.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-900 line-clamp-2">
                            {item.name}
                          </h4>
                          <p className="text-gray-600 text-xs sm:text-sm mt-1">
                            Size: {item.size}
                          </p>
                          {item.isWholesale && (
                            <span className="inline-flex px-1 sm:px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 mt-1">
                              Wholesale
                            </span>
                          )}
                          <div className="mt-1 sm:mt-2">
                            <p className="text-blue-sip-600 font-medium text-xs sm:text-sm md:text-base">
                              ₹{actualPrice.toLocaleString('en-IN')}
                            </p>
                            {item.originalPrice && actualPrice < item.originalPrice && (
                              <p className="text-gray-500 line-through text-xs">
                                ₹{item.originalPrice.toLocaleString('en-IN')}
                              </p>
                            )}
                          </div>

                          {/* Mobile Quantity and Price Row */}
                          <div className="flex items-center justify-between mt-2 sm:mt-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleUpdateQuantity(item._id, item.quantity - 1, item.isWholesale)}
                                className="p-1 sm:p-2 hover:bg-gray-100 rounded-l-lg"
                              >
                                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                              <span className="px-2 sm:px-3 py-1 sm:py-2 border-x border-gray-300 min-w-[30px] sm:min-w-[40px] text-center text-xs sm:text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item._id, item.quantity + 1, item.isWholesale)}
                                className="p-1 sm:p-2 hover:bg-gray-100 rounded-r-lg"
                              >
                                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </div>

                            {/* Total Price and Remove */}
                            <div className="flex items-center space-x-2">
                              <div className="text-right">
                                <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-900">
                                  ₹{(actualPrice * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </p>
                              </div>
                              <button
                                onClick={() => handleRemoveItem(item._id, item.name, item.isWholesale)}
                                className="p-1 sm:p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 sticky top-20">
              <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-3 sm:mb-4 md:mb-6">Order Summary</h3>
              
              {/* Bottle Count Display */}
              <div className="mb-4 sm:mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Total Bottles:</span>
                    <span className="text-blue-600 font-bold text-sm sm:text-base">{totalBottles}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Total Boxes:</span>
                    <span className="text-blue-600 font-bold text-sm sm:text-base">
                      {totalBoxes} {totalBoxes > 0 && <span className="text-xs text-gray-500">({totalBottles % BOTTLES_PER_BOX > 0 ? `+ ${totalBottles % BOTTLES_PER_BOX} bottles` : 'complete'})</span>}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Minimum Required:</span>
                      <span className="text-gray-900 font-bold text-sm sm:text-base">{MINIMUM_BOTTLES} bottles</span>
                    </div>
                  </div>
                  {!minimumMet && (
                    <div className="pt-2 border-t border-orange-200 bg-orange-50 -mx-3 -mb-3 px-3 py-2 rounded-b-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-orange-700 font-semibold text-xs sm:text-sm">Need to add:</span>
                        <span className="text-orange-600 font-bold text-sm sm:text-base">{remainingBottles} bottles</span>
                      </div>
                    </div>
                  )}
                  {minimumMet && (
                    <div className="pt-2 border-t border-green-200 bg-green-50 -mx-3 -mb-3 px-3 py-2 rounded-b-lg">
                      <div className="flex items-center justify-center text-green-700 font-semibold text-xs sm:text-sm">
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Minimum order met!
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-3 sm:mb-4 md:mb-6">
                <div className="flex justify-between text-xs sm:text-sm md:text-base text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm md:text-base text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-2 sm:pt-3 md:pt-4">
                  <div className="flex justify-between text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {minimumMet ? (
                <Link
                  to="/checkout"
                  className="w-full btn-primary flex items-center justify-center space-x-2 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-2 sm:py-3 px-4 rounded-lg font-medium cursor-not-allowed mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base flex items-center justify-center"
                  title={`Add ${remainingBottles} more bottles to checkout`}
                >
                  <span>Minimum Order Not Met</span>
                </button>
              )}

              <Link
                to="/products"
                className="w-full btn-secondary text-center block text-xs sm:text-sm md:text-base"
              >
                Continue Shopping
              </Link>

              {/* Security Badges */}
              <div className="mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 md:pt-6 border-t">
                <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Secure Checkout</span>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-400 mt-1 sm:mt-2">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart