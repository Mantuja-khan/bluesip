import express from 'express'
import { body, query, validationResult } from 'express-validator'
import Product from '../models/Product.js'
import { auth, adminAuth } from '../middleware/auth.js'

const router = express.Router()

// Get all products (with filtering, sorting, pagination)
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isIn(['water-bottle', 'accessories', 'gift-sets']).withMessage('Invalid category'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be non-negative'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be non-negative'),
  query('sort').optional().isIn(['name', 'price', 'createdAt', '-name', '-price', '-createdAt']).withMessage('Invalid sort option')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sort = '-createdAt'
    } = req.query

    // Build filter object
    const filter = { isActive: true }

    if (category) {
      filter.category = category
    }

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Product.countDocuments(filter)
    const totalPages = Math.ceil(total / parseInt(limit))

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    })
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({ message: 'Server error while fetching products' })
  }
})

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true })
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({ product })
  } catch (error) {
    console.error('Get product error:', error)
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.status(500).json({ message: 'Server error while fetching product' })
  }
})

// Create product (Admin only)
router.post('/', adminAuth, [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('size').trim().notEmpty().withMessage('Size is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('category').optional().isIn(['water-bottle', 'accessories', 'gift-sets']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const product = new Product(req.body)
    await product.save()

    res.status(201).json({ message: 'Product created successfully', product })
  } catch (error) {
    console.error('Create product error:', error)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Product with this name already exists' })
    }
    res.status(500).json({ message: 'Server error while creating product' })
  }
})

// Update product (Admin only)
router.put('/:id', adminAuth, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('size').optional().trim().notEmpty().withMessage('Size cannot be empty'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('category').optional().isIn(['water-bottle', 'accessories', 'gift-sets']).withMessage('Invalid category'),
  body('discount').optional().isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({ message: 'Product updated successfully', product })
  } catch (error) {
    console.error('Update product error:', error)
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.status(500).json({ message: 'Server error while updating product' })
  }
})

// Delete product (Admin only) - HARD DELETE
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Delete product error:', error)
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.status(500).json({ message: 'Server error while deleting product' })
  }
})

// Get all products for admin (including inactive)
router.get('/admin/all', adminAuth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const { page = 1, limit = 20, search, category, status } = req.query

    // Build filter object
    const filter = {}

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    if (category) {
      filter.category = category
    }

    if (status !== undefined) {
      filter.isActive = status === 'active'
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const products = await Product.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Product.countDocuments(filter)
    const totalPages = Math.ceil(total / parseInt(limit))

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    })
  } catch (error) {
    console.error('Get admin products error:', error)
    res.status(500).json({ message: 'Server error while fetching products' })
  }
})

export default router