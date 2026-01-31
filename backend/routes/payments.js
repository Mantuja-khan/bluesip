import express from 'express'
import { body, validationResult } from 'express-validator'
import { auth } from '../middleware/auth.js'
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handlePaymentFailure,
  getPaymentDetails
} from '../controllers/paymentController.js'

const router = express.Router()

// Create Razorpay order
router.post('/create-order', auth, [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be non-negative'),
  body('currency').optional().isIn(['INR']).withMessage('Currency must be INR'),
  body('orderId').isMongoId().withMessage('Invalid order ID')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: errors.array()[0].msg 
    })
  }
  
  await createRazorpayOrder(req, res)
})

// Verify Razorpay payment
router.post('/verify-payment', auth, [
  body('razorpay_order_id').notEmpty().withMessage('Razorpay order ID is required'),
  body('razorpay_payment_id').notEmpty().withMessage('Razorpay payment ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Razorpay signature is required'),
  body('orderId').isMongoId().withMessage('Invalid order ID')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: errors.array()[0].msg 
    })
  }
  
  await verifyRazorpayPayment(req, res)
})

// Handle payment failure
router.post('/payment-failed', auth, [
  body('orderId').isMongoId().withMessage('Invalid order ID'),
  body('error').notEmpty().withMessage('Error details are required')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: errors.array()[0].msg 
    })
  }
  
  await handlePaymentFailure(req, res)
})

// Get payment details
router.get('/:paymentId', auth, async (req, res) => {
  await getPaymentDetails(req, res)
})

export default router