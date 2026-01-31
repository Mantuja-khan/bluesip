import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  size: {
    type: String,
    required: [true, 'Product size is required'],
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['water-bottle', 'accessories', 'gift-sets'],
    default: 'water-bottle'
  },
  material: {
    type: String,
    default: 'Stainless Steel'
  },
  capacity: {
    type: String,
    default: '500ml'
  },
  features: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0
  },
  discountedPrice: {
    type: Number,
    min: [0, 'Discounted price cannot be negative']
  },
  // Wholesale options
  isWholesale: {
    type: Boolean,
    default: false
  },
  wholesalePrice: {
    type: Number,
    min: [0, 'Wholesale price cannot be negative']
  },
  minWholesaleQuantity: {
    type: Number,
    min: [1, 'Minimum wholesale quantity must be at least 1'],
    default: 10
  },
  wholesaleDescription: {
    type: String,
    maxlength: [500, 'Wholesale description cannot exceed 500 characters']
  }
}, {
  timestamps: true
})

// Calculate discounted price before saving
productSchema.pre('save', function(next) {
  if (this.discount > 0) {
    this.discountedPrice = this.price - (this.price * this.discount / 100)
  } else {
    this.discountedPrice = this.price
  }
  next()
})

// Virtual for final price
productSchema.virtual('finalPrice').get(function() {
  return this.discount > 0 ? this.discountedPrice : this.price
})

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true })

export default mongoose.model('Product', productSchema)