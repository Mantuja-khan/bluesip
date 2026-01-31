import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  currency: {
  type: String,
  required: true,
  default: 'INR'
},
  paymentMethod: {
  type: String,
  required: true,
  enum: ['card', 'upi', 'wallet', 'netbanking', 'emi', 'paylater', 'paypal', 'bank_transfer','razorpay']
},
  paymentProvider: {
  type: String,
  required: true,
  enum: ['stripe', 'paypal', 'razorpay'],
  default: 'razorpay'
},
  paymentId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  failureReason: {
    type: String
  },
  refundId: {
    type: String
  },
  refundAmount: {
    type: Number,
    min: [0, 'Refund amount cannot be negative']
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
})

// Index for efficient queries
paymentSchema.index({ order: 1 })
paymentSchema.index({ user: 1, createdAt: -1 })
paymentSchema.index({ status: 1 })
paymentSchema.index({ paymentId: 1 })

export default mongoose.model('Payment', paymentSchema)