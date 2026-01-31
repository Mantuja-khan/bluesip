


import Razorpay from 'razorpay'
import crypto from 'crypto'
import shortid from 'shortid'
import Payment from '../models/Payment.js'
import Order from '../models/Order.js'
import { sendOrderConfirmationEmail } from '../utils/email.js'
import dotenv from 'dotenv';
dotenv.config();
import { generateOrderNumber } from "../utils/orderNumber.js"


// Validate Razorpay credentials
const validateRazorpayCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  
  if (!keyId || !keySecret || keyId === 'rzp_test_1234567890' || keySecret === 'test_secret_key') {
    console.error('❌ RAZORPAY CREDENTIALS NOT CONFIGURED!')
    console.error('Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file')
    console.error('Get your credentials from: https://dashboard.razorpay.com/app/keys')
    return false
  }
  
  console.log('✅ Razorpay credentials configured')
  return true
}

// Initialize Razorpay with validation
let razorpay
try {
  if (validateRazorpayCredentials()) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })
    console.log('✅ Razorpay initialized successfully')
  } else {
    console.error('❌ Razorpay initialization failed - Invalid credentials')
  }
} catch (error) {
  console.error('❌ Razorpay initialization error:', error.message)
}

// Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    // Check if Razorpay is properly initialized
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: 'Payment gateway not configured. Please contact support.',
        error: 'RAZORPAY_NOT_CONFIGURED'
      })
    }

    const { amount, currency = 'INR', orderId } = req.body

    console.log('Creating Razorpay order for:', { amount, currency, orderId })

    // Verify order exists and belongs to user
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      })
    }

    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      })
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ 
        success: false, 
        message: 'Order is already paid' 
      })
    }

    // Generate short receipt ID (less than 40 characters)
    const receiptId = `BS_${shortid.generate()}_${Date.now().toString().slice(-6)}`
    
    // Create Razorpay order
    const razorpayOrderData = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receiptId,
      notes: {
        orderId: orderId,
        userId: req.user.userId,
        customerName: req.user.name,
        customerEmail: req.user.email
      }
    }

    console.log('Razorpay order data:', razorpayOrderData)

    const razorpayOrder = await razorpay.orders.create(razorpayOrderData)

    console.log('✅ Razorpay order created successfully:', razorpayOrder.id)

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      name: 'Blue Sip',
      description: 'Premium Water Bottles',
      image: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=100',
      prefill: {
        name: req.user.name,
        email: req.user.email,
        contact: order.shippingAddress?.phone || ''
      },
      theme: {
        color: '#2563eb'
      }
    })
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error)
    
    // Handle specific Razorpay errors
    if (error.statusCode === 401) {
      return res.status(500).json({
        success: false,
        message: 'Payment gateway authentication failed. Please contact support.',
        error: 'RAZORPAY_AUTH_FAILED'
      })
    }
    
    if (error.statusCode === 400) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment request. Please check your order details.',
        error: 'RAZORPAY_BAD_REQUEST'
      })
    }

    res.status(500).json({ 
      success: false, 
      message: 'Failed to create payment order. Please try again.',
      error: error.message 
    })
  }
}

// Verify Razorpay payment
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      orderId 
    } = req.body

    console.log('🔍 Payment verification request:', {
      razorpay_order_id,
      razorpay_payment_id,
      orderId
    })

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

    console.log('🔐 Signature verification:', {
      expected: expectedSignature,
      received: razorpay_signature,
      match: expectedSignature === razorpay_signature
    })

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment signature' 
      })
    }

    // Get order details
    const order = await Order.findById(orderId).populate('user', 'name email').populate('items.product', 'name price')
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      })
    }

    if (order.user._id.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      })
    }

    // Fetch payment details from Razorpay
    let paymentDetails
    try {
      paymentDetails = await razorpay.payments.fetch(razorpay_payment_id)
      console.log('💳 Payment details from Razorpay:', {
        id: paymentDetails.id,
        amount: paymentDetails.amount,
        status: paymentDetails.status,
        method: paymentDetails.method
      })
    } catch (error) {
      console.error('❌ Error fetching payment details:', error)
      return res.status(400).json({ 
        success: false, 
        message: 'Failed to verify payment with Razorpay' 
      })
    }

    // Create payment record
    const payment = new Payment({
      order: orderId,
      user: req.user.userId,
      amount: paymentDetails.amount / 100, // Convert from paise to rupees
      currency: paymentDetails.currency,
      paymentMethod: paymentDetails.method,
      paymentProvider: 'razorpay',
      paymentId: razorpay_payment_id,
      status: 'succeeded',
      metadata: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        method: paymentDetails.method,
        bank: paymentDetails.bank,
        wallet: paymentDetails.wallet,
        vpa: paymentDetails.vpa,
        card_id: paymentDetails.card_id
      }
    })
    await payment.save()

    // Update order status
    order.paymentStatus = 'paid'
    order.paymentId = razorpay_payment_id
    order.paymentMethod = paymentDetails.method
    order.status = 'processing'
    await order.save()

    console.log('✅ Payment verification successful for order:', orderId)

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(order.user.email, {
        orderId : order._id.toString().slice(0, 8), // ✅ Safe usage
        createdAt: order.createdAt,
        total: order.total,
        customerName: order.user.name,
        items: order.items,
        shippingAddress: order.shippingAddress,
        paymentMethod: paymentDetails.method,
        paymentId: razorpay_payment_id
      })
      console.log('📧 Order confirmation email sent to:', order.user.email)
    } catch (emailError) {
      console.error('❌ Error sending confirmation email:', emailError)
      // Don't fail the payment verification if email fails
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment: {
        id: payment._id,
        paymentId: razorpay_payment_id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        method: paymentDetails.method
      },
      order: {
        id: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus
      }
    })
  } catch (error) {
    console.error('❌ Error verifying payment:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Payment verification failed',
      error: error.message 
    })
  }
}

// Handle payment failure
export const handlePaymentFailure = async (req, res) => {
  try {
    const { orderId, error } = req.body

    console.log('❌ Payment failure for order:', orderId, error)

    // Get order details
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      })
    }

    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      })
    }

    // Create failed payment record
    const payment = new Payment({
      order: orderId,
      user: req.user.userId,
      amount: order.total,
      currency: 'INR',
      paymentMethod: 'razorpay',
      paymentProvider: 'razorpay',
      paymentId: `failed_${Date.now()}`,
      status: 'failed',
      failureReason: error.description || 'Payment failed',
      metadata: error
    })
    await payment.save()

    // Update order status
    order.paymentStatus = 'failed'
    await order.save()

    console.log('📝 Payment failure recorded for order:', orderId)

    res.json({
      success: false,
      message: 'Payment failed',
      error: error.description || 'Payment failed'
    })
  } catch (error) {
    console.error('❌ Error handling payment failure:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process payment failure' 
    })
  }
}

// Get payment details
export const getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findOne({ paymentId: req.params.paymentId })
      .populate('order')
      .populate('user', 'name email')

    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      })
    }

    // Check if user owns the payment or is admin
    if (payment.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      })
    }

    res.json({ 
      success: true, 
      payment 
    })
  } catch (error) {
    console.error('❌ Get payment error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching payment' 
    })
  }
}