import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { CreditCard, Lock, MapPin, User, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'
const Checkout = () => {
  const { cartItems, getCartTotal, clearCart, getActualPrice } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [orderId, setOrderId] = useState(location.state?.orderId || null)
  const [isBuyNow, setIsBuyNow] = useState(location.state?.buyNow || false)
  const [orderData, setOrderData] = useState(null)
  
  const [formData, setFormData] = useState({
    // Shipping Address
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  })

  const subtotal = isBuyNow && orderData ? orderData.subtotal : getCartTotal()
  const total = subtotal 

  useEffect(() => {
    if (isBuyNow && orderId) {
      fetchOrderData()
    } else if (cartItems.length === 0 && !isBuyNow) {
      navigate('/cart')
    }
  }, [cartItems, navigate, isBuyNow, orderId])

  const fetchOrderData = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      setOrderData(response.data.order)
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('Order not found')
      navigate('/cart')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateStep1 = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
    return required.every(field => formData[field].trim() !== '')
  }

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 1) {
      toast.error('Please fill in all shipping information')
    }
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      let currentOrderId = orderId

      // Create order if not Buy Now
      if (!isBuyNow) {
        console.log('Creating new order...')
        const orderPayload = {
          items: cartItems.map(item => ({
            product: item._id,
            quantity: item.quantity,
            price: getActualPrice(item),
            isWholesale: item.isWholesale || false
          })),
          shippingAddress: {
            fullName: formData.fullName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
            phone: formData.phone
          },
          paymentMethod: 'upi',
          subtotal,
          tax: 0, // No GST
          total,
          orderType: cartItems.some(item => item.isWholesale) ? 'wholesale' : 'regular'
        }

        const orderResponse = await axios.post(`${API_URL}/orders`, orderPayload, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        currentOrderId = orderResponse.data.order._id
        console.log('✅ Order created:', currentOrderId)
      }

      // Create Razorpay order
      console.log('Creating Razorpay order...')
      const razorpayResponse = await axios.post(`${API_URL}/payments/create-order`, {
        amount: total,
        currency: 'INR',
        orderId: currentOrderId
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })

      console.log('Razorpay response:', razorpayResponse.data)

      if (!razorpayResponse.data.success) {
        throw new Error(razorpayResponse.data.message || 'Failed to create payment order')
      }

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh the page and try again.')
      }

      // Initialize Razorpay payment
      const options = {
        key: razorpayResponse.data.key,
        amount: razorpayResponse.data.amount,
        currency: razorpayResponse.data.currency,
        name: razorpayResponse.data.name,
        description: razorpayResponse.data.description,
        image: razorpayResponse.data.image,
        order_id: razorpayResponse.data.orderId,
        prefill: razorpayResponse.data.prefill,
        theme: razorpayResponse.data.theme,
        handler: async function (response) {
          console.log('✅ Payment successful:', response)
          try {
            // Verify payment
            const verifyResponse = await axios.post(`${API_URL}/payments/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: currentOrderId
            }, {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })

            console.log('Payment verification response:', verifyResponse.data)

            if (verifyResponse.data.success) {
              if (!isBuyNow) {
                clearCart()
              }
              toast.success('Payment successful! Order placed.')
              navigate('/orders')
            } else {
              toast.error('Payment verification failed')
            }
          } catch (error) {
            console.error('❌ Payment verification error:', error)
            toast.error('Payment verification failed')
          } finally {
            setLoading(false)
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed')
            toast.info('Payment cancelled')
            setLoading(false)
          }
        }
      }

      console.log('Opening Razorpay with options:', options)

      const rzp = new window.Razorpay(options)
      
      rzp.on('payment.failed', async function (response) {
        console.log('❌ Payment failed:', response.error)
        try {
          await axios.post(`${API_URL}/payments/payment-failed`, {
            orderId: currentOrderId,
            error: response.error
          }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
        } catch (error) {
          console.error('Error logging payment failure:', error)
        }
        
        toast.error(`Payment failed: ${response.error.description}`)
        setLoading(false)
      })

      rzp.open()
    } catch (error) {
      console.error('❌ Error placing order:', error)
      
      // Handle specific error types
      if (error.response?.data?.error === 'RAZORPAY_NOT_CONFIGURED') {
        toast.error('Payment system is currently unavailable. Please contact support.')
      } else if (error.response?.data?.error === 'RAZORPAY_AUTH_FAILED') {
        toast.error('Payment gateway error. Please contact support.')
      } else {
        toast.error(error.response?.data?.message || 'Failed to place order. Please try again.')
      }
      
      setLoading(false)
    }
  }

  if ((cartItems.length === 0 && !isBuyNow) || (isBuyNow && !orderData)) {
    return null
  }

  const displayItems = isBuyNow ? orderData.items : cartItems

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-blue-sip-600 hover:text-blue-sip-700 mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">Checkout</h1>

        {/* Progress Bar */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-sip-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center border-2 text-xs sm:text-sm ${
                step >= 1 ? 'border-blue-sip-600 bg-blue-sip-600 text-white' : 'border-gray-300'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium text-xs sm:text-sm md:text-base">Shipping</span>
            </div>
            <div className={`flex-1 h-1 mx-2 sm:mx-4 ${step >= 2 ? 'bg-blue-sip-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-sip-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center border-2 text-xs sm:text-sm ${
                step >= 2 ? 'border-blue-sip-600 bg-blue-sip-600 text-white' : 'border-gray-300'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium text-xs sm:text-sm md:text-base">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-sip-600" />
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="input-field text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field text-sm sm:text-base"
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="input-field text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="input-field text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="input-field text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="input-field text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="input-field text-sm sm:text-base"
                    >
                      <option value="India">India</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 flex justify-end">
                  <button onClick={handleNextStep} className="btn-primary w-full sm:w-auto text-sm sm:text-base">
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-blue-sip-600" />
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Payment Information</h2>
                </div>

                <div className="text-center p-4 sm:p-6 md:p-8">
                  <div className="mb-4 sm:mb-6">
                    <img 
                      src="https://razorpay.com/assets/razorpay-logo.svg" 
                      alt="Razorpay" 
                      className="h-6 sm:h-8 mx-auto mb-3 sm:mb-4"
                    />
                    <p className="text-gray-600 mb-2 text-xs sm:text-sm md:text-base">
                      Secure payment powered by Razorpay
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Supports UPI, Cards, Net Banking, PhonePe, Google Pay, and Wallets
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Order Total</h3>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-sip-600">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="btn-secondary order-2 sm:order-1 text-sm sm:text-base"
                    >
                      Back to Shipping
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="btn-primary disabled:opacity-50 flex items-center justify-center space-x-2 order-1 sm:order-2 text-sm sm:text-base"
                    >
                      <Lock className="h-4 w-4" />
                      <span>{loading ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-8">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6">Order Summary</h3>
              
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                {displayItems.map((item, index) => {
                  const itemPrice = isBuyNow 
                    ? item.price 
                    : getActualPrice(item)
                  return (
                    <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                      <img
                        src={item.product?.image || item.image || 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt={item.product?.name || item.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {item.product?.name || item.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity}
                          {item.isWholesale && <span className="text-orange-600 ml-1">(Wholesale)</span>}
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        ₹{(itemPrice * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-2 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b">
                <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-base sm:text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              {step === 2 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-green-800 flex items-center">
                    <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Secure payment with Razorpay
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout