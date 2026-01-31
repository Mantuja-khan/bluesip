// import mongoose from 'mongoose'

// const orderItemSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: [1, 'Quantity must be at least 1']
//   },
//   price: {
//     type: Number,
//     required: true,
//     min: [0, 'Price cannot be negative']
//   },
//   isWholesale: {
//     type: Boolean,
//     default: false
//   }
// })

// const shippingAddressSchema = new mongoose.Schema({
//   fullName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   address: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   city: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   state: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   zipCode: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   country: {
//     type: String,
//     required: true,
//     trim: true,
//     default: 'India'
//   },
//   phone: {
//     type: String,
//     required: true,
//     trim: true
//   }
// })

// const orderSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   items: [orderItemSchema],
//   shippingAddress: {
//     type: shippingAddressSchema,
//     required: true
//   },
//   paymentMethod: {
//     type: String,
//     required: true,
//     enum: ['card', 'upi', 'phonepe', 'googlepay', 'paytm', 'netbanking','wallet'],
//     default: 'upi'
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'paid', 'failed', 'refunded'],
//     default: 'pending'
//   },
//   paymentId: {
//     type: String
//   },
//   upiId: {
//     type: String
//   },
//   subtotal: {
//     type: Number,
//     required: true,
//     min: [0, 'Subtotal cannot be negative']
//   },
//   tax: {
//     type: Number,
//     required: true,
//     min: [0, 'Tax cannot be negative'],
//     default: 0
//   },
//   shippingCost: {
//     type: Number,
//     min: [0, 'Shipping cost cannot be negative'],
//     default: 0
//   },
//   total: {
//     type: Number,
//     required: true,
//     min: [0, 'Total cannot be negative']
//   },
//   currency: {
//     type: String,
//     default: 'INR'
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
//     default: 'pending'
//   },
//   trackingNumber: {
//     type: String
//   },
//   notes: {
//     type: String,
//     maxlength: [500, 'Notes cannot exceed 500 characters']
//   },
//   deliveredAt: {
//     type: Date
//   },
//   cancelledAt: {
//     type: Date
//   },
//   cancelReason: {
//     type: String,
//     maxlength: [200, 'Cancel reason cannot exceed 200 characters']
//   },
//   orderType: {
//     type: String,
//     enum: ['regular', 'wholesale'],
//     default: 'regular'
//   }
// }, {
//   timestamps: true
// })

// // Index for efficient queries
// orderSchema.index({ user: 1, createdAt: -1 })
// orderSchema.index({ status: 1 })
// orderSchema.index({ paymentStatus: 1 })

// export default mongoose.model('Order', orderSchema)





import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  isWholesale: {
    type: Boolean,
    default: false
  }
})

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: 'India'
  },
  phone: {
    type: String,
    required: true,
    trim: true
  }
})

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'upi', 'phonepe', 'googlepay', 'paytm', 'netbanking','wallet'],
    default: 'upi'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: {
    type: String
  },
  upiId: {
    type: String
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  tax: {
    type: Number,
    required: true,
    min: [0, 'Tax cannot be negative'],
    default: 0
  },
  shippingCost: {
    type: Number,
    min: [0, 'Shipping cost cannot be negative'],
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: {
    type: String
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  deliveredAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancelReason: {
    type: String,
    maxlength: [200, 'Cancel reason cannot exceed 200 characters']
  },
  orderType: {
    type: String,
    enum: ['regular', 'wholesale'],
    default: 'regular'
  }
}, {
  timestamps: true
})

// Index for efficient queries
orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ status: 1 })
orderSchema.index({ paymentStatus: 1 })

export default mongoose.model('Order', orderSchema)
