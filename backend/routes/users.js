import express from 'express'
import { query, body, validationResult } from 'express-validator'
import User from '../models/User.js'
import Order from '../models/Order.js'
import { adminAuth } from '../middleware/auth.js'

const router = express.Router()

// Get all users (Admin only)
router.get('/', adminAuth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim().isLength({ min: 1 }).withMessage('Search term cannot be empty'),
  query('status').optional().isIn(['active', 'blocked', 'unverified']).withMessage('Invalid status filter')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const { page = 1, limit = 20, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query

    // Build filter object
    const filter = {}

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    if (status) {
      switch (status) {
        case 'active':
          filter.isVerified = true
          filter.isBlocked = false
          break
        case 'blocked':
          filter.isBlocked = true
          break
        case 'unverified':
          filter.isVerified = false
          break
      }
    }

    // Build sort object
    const sort = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const users = await User.find(filter)
      .select('-password -otp')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))

    const total = await User.countDocuments(filter)
    const totalPages = Math.ceil(total / parseInt(limit))

    // Get user statistics
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          verifiedUsers: {
            $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] }
          },
          blockedUsers: {
            $sum: { $cond: [{ $eq: ['$isBlocked', true] }, 1, 0] }
          },
          adminUsers: {
            $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
          }
        }
      }
    ])

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      },
      stats: stats[0] || {
        totalUsers: 0,
        verifiedUsers: 0,
        blockedUsers: 0,
        adminUsers: 0
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ message: 'Server error while fetching users' })
  }
})

// Get single user details (Admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -otp')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Get user's order statistics
    const orderStats = await Order.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      }
    ])

    // Get recent orders
    const recentOrders = await Order.find({ user: user._id })
      .populate('items.product', 'name price')
      .sort('-createdAt')
      .limit(5)

    res.json({
      user,
      orderStats: orderStats[0] || {
        totalOrders: 0,
        totalSpent: 0,
        completedOrders: 0,
        cancelledOrders: 0
      },
      recentOrders
    })
  } catch (error) {
    console.error('Get user details error:', error)
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(500).json({ message: 'Server error while fetching user details' })
  }
})

// Block/Unblock user (Admin only)
router.patch('/:id/block', adminAuth, [
  body('isBlocked').isBoolean().withMessage('isBlocked must be a boolean'),
  body('reason').optional().trim().isLength({ max: 200 }).withMessage('Reason cannot exceed 200 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const { isBlocked, reason } = req.body

    const user = await User.findById(req.params.id).select('-password -otp')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Prevent blocking admin users
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot block admin users' })
    }

    user.isBlocked = isBlocked
    await user.save()

    const action = isBlocked ? 'blocked' : 'unblocked'
    res.json({ 
      message: `User ${action} successfully`, 
      user,
      reason 
    })
  } catch (error) {
    console.error('Block user error:', error)
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(500).json({ message: 'Server error while updating user status' })
  }
})

// Delete user (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin users' })
    }

    // Check if user has active orders
    const activeOrders = await Order.countDocuments({
      user: user._id,
      status: { $in: ['pending', 'processing', 'shipped'] }
    })

    if (activeOrders > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete user with active orders. Please complete or cancel all orders first.' 
      })
    }

    await User.findByIdAndDelete(req.params.id)

    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(500).json({ message: 'Server error while deleting user' })
  }
})

// Update user role (Admin only)
router.patch('/:id/role', adminAuth, [
  body('role').isIn(['user', 'admin']).withMessage('Role must be either user or admin')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const { role } = req.body

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password -otp')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ message: 'User role updated successfully', user })
  } catch (error) {
    console.error('Update user role error:', error)
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(500).json({ message: 'Server error while updating user role' })
  }
})

export default router