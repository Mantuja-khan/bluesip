// import express from 'express'
// import { body, query, validationResult } from 'express-validator'
// import Order from '../models/Order.js'
// import Product from '../models/Product.js'
// import { auth, adminAuth } from '../middleware/auth.js'

// const router = express.Router()

// // Create new order
// router.post('/', auth, [
//   body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
//   body('items.*.product').isMongoId().withMessage('Invalid product ID'),
//   body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
//   body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
//   body('shippingAddress.fullName').trim().notEmpty().withMessage('Full name is required'),
//   body('shippingAddress.address').trim().notEmpty().withMessage('Address is required'),
//   body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
//   body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
//   body('shippingAddress.zipCode').trim().notEmpty().withMessage('ZIP code is required'),
//   body('shippingAddress.phone').trim().notEmpty().withMessage('Phone number is required'),
//   body('paymentMethod').isIn(['razorpay', 'card', 'upi', 'phonepe', 'googlepay', 'paytm', 'netbanking']).withMessage('Invalid payment method'),
//   body('subtotal').isFloat({ min: 0 }).withMessage('Subtotal must be non-negative'),
//   body('total').isFloat({ min: 0 }).withMessage('Total must be non-negative')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ message: errors.array()[0].msg })
//     }

//     const { items, shippingAddress, paymentMethod, subtotal, total, notes, orderType } = req.body

//     // Verify products exist and have sufficient stock
//     for (const item of items) {
//       const product = await Product.findById(item.product)
//       if (!product) {
//         return res.status(404).json({ message: `Product not found: ${item.product}` })
//       }
//       if (!product.isActive) {
//         return res.status(400).json({ message: `Product is no longer available: ${product.name}` })
//       }
//       if (product.stock < item.quantity) {
//         return res.status(400).json({ 
//           message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
//         })
//       }
//     }

//     // Create order
//     const order = new Order({
//       user: req.user.userId,
//       items,
//       shippingAddress,
//       paymentMethod: paymentMethod || 'razorpay',
//       subtotal,
//       tax: 0, // No GST
//       total,
//       notes,
//       orderType: orderType || 'regular',
//       currency: 'INR'
//     })

//     await order.save()

//     // Update product stock
//     for (const item of items) {
//       await Product.findByIdAndUpdate(
//         item.product,
//         { $inc: { stock: -item.quantity } }
//       )
//     }

//     // Populate product details
//     await order.populate('items.product', 'name image price size')

//     res.status(201).json({ message: 'Order created successfully', order })
//   } catch (error) {
//     console.error('Create order error:', error)
//     res.status(500).json({ message: 'Server error while creating order' })
//   }
// })

// // Get user orders
// router.get('/user', auth, [
//   query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
//   query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
//   query('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ message: errors.array()[0].msg })
//     }

//     const { page = 1, limit = 10, status } = req.query

//     // Build filter
//     const filter = { user: req.user.userId }
//     if (status) {
//       filter.status = status
//     }

//     // Execute query with pagination
//     const skip = (parseInt(page) - 1) * parseInt(limit)
//     const orders = await Order.find(filter)
//       .populate('items.product', 'name image price size')
//       .sort('-createdAt')
//       .skip(skip)
//       .limit(parseInt(limit))

//     const total = await Order.countDocuments(filter)
//     const totalPages = Math.ceil(total / parseInt(limit))

//     res.json({
//       orders,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages,
//         totalOrders: total,
//         hasNextPage: parseInt(page) < totalPages,
//         hasPrevPage: parseInt(page) > 1
//       }
//     })
//   } catch (error) {
//     console.error('Get user orders error:', error)
//     res.status(500).json({ message: 'Server error while fetching orders' })
//   }
// })

// // Get single order
// router.get('/:id', auth, async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('items.product', 'name image price size')
//       .populate('user', 'name email')

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' })
//     }

//     // Check if user owns the order or is admin
//     if (order.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied' })
//     }

//     res.json({ order })
//   } catch (error) {
//     console.error('Get order error:', error)
//     if (error.name === 'CastError') {
//       return res.status(404).json({ message: 'Order not found' })
//     }
//     res.status(500).json({ message: 'Server error while fetching order' })
//   }
// })

// // Cancel order
// router.patch('/:id/cancel', auth, [
//   body('reason').optional().trim().isLength({ max: 200 }).withMessage('Cancel reason cannot exceed 200 characters')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ message: errors.array()[0].msg })
//     }

//     const order = await Order.findById(req.params.id)
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' })
//     }

//     // Check if user owns the order
//     if (order.user.toString() !== req.user.userId) {
//       return res.status(403).json({ message: 'Access denied' })
//     }

//     // Check if order can be cancelled
//     if (!['pending', 'processing'].includes(order.status)) {
//       return res.status(400).json({ message: 'Order cannot be cancelled at this stage' })
//     }

//     // Update order status
//     order.status = 'cancelled'
//     order.cancelledAt = new Date()
//     order.cancelReason = req.body.reason || 'Cancelled by user'
//     await order.save()

//     // Restore product stock
//     for (const item of order.items) {
//       await Product.findByIdAndUpdate(
//         item.product,
//         { $inc: { stock: item.quantity } }
//       )
//     }

//     res.json({ message: 'Order cancelled successfully', order })
//   } catch (error) {
//     console.error('Cancel order error:', error)
//     if (error.name === 'CastError') {
//       return res.status(404).json({ message: 'Order not found' })
//     }
//     res.status(500).json({ message: 'Server error while cancelling order' })
//   }
// })

// // Admin: Get all orders
// router.get('/admin/all', adminAuth, [
//   query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
//   query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
//   query('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
//   query('paymentStatus').optional().isIn(['pending', 'paid', 'failed', 'refunded']).withMessage('Invalid payment status')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ message: errors.array()[0].msg })
//     }

//     const { page = 1, limit = 20, status, paymentStatus, search } = req.query

//     // Build filter
//     const filter = {}
//     if (status) filter.status = status
//     if (paymentStatus) filter.paymentStatus = paymentStatus

//     if (search) {
//       filter.$or = [
//         { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
//         { 'shippingAddress.email': { $regex: search, $options: 'i' } }
//       ]
//     }

//     // Execute query with pagination
//     const skip = (parseInt(page) - 1) * parseInt(limit)
//     const orders = await Order.find(filter)
//       .populate('user', 'name email')
//       .populate('items.product', 'name image price')
//       .sort('-createdAt')
//       .skip(skip)
//       .limit(parseInt(limit))

//     const total = await Order.countDocuments(filter)
//     const totalPages = Math.ceil(total / parseInt(limit))

//     // Calculate statistics - Only include paid orders in revenue
//     const stats = await Order.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalOrders: { $sum: 1 },
//           totalRevenue: { 
//             $sum: { 
//               $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$total', 0] 
//             } 
//           },
//           pendingOrders: {
//             $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
//           },
//           processingOrders: {
//             $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
//           }
//         }
//       }
//     ])

//     res.json({
//       orders,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages,
//         totalOrders: total,
//         hasNextPage: parseInt(page) < totalPages,
//         hasPrevPage: parseInt(page) > 1
//       },
//       stats: stats[0] || {
//         totalOrders: 0,
//         totalRevenue: 0,
//         pendingOrders: 0,
//         processingOrders: 0
//       }
//     })
//   } catch (error) {
//     console.error('Get admin orders error:', error)
//     res.status(500).json({ message: 'Server error while fetching orders' })
//   }
// })

// // Admin: Update order status
// router.patch('/admin/:id/status', adminAuth, [
//   body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
//   body('trackingNumber').optional().trim().isLength({ max: 50 }).withMessage('Tracking number cannot exceed 50 characters'),
//   body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ message: errors.array()[0].msg })
//     }

//     const { status, trackingNumber, notes } = req.body

//     const updateData = { status }
//     if (trackingNumber) updateData.trackingNumber = trackingNumber
//     if (notes) updateData.notes = notes

//     if (status === 'delivered') {
//       updateData.deliveredAt = new Date()
//     }

//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     ).populate('user', 'name email')
//      .populate('items.product', 'name image price')

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' })
//     }

//     res.json({ message: 'Order status updated successfully', order })
//   } catch (error) {
//     console.error('Update order status error:', error)
//     if (error.name === 'CastError') {
//       return res.status(404).json({ message: 'Order not found' })
//     }
//     res.status(500).json({ message: 'Server error while updating order status' })
//   }
// })

// export default router




import express from 'express'
import { body, query, validationResult } from 'express-validator'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import { auth, adminAuth } from '../middleware/auth.js'
import nodemailer from 'nodemailer'

const router = express.Router()

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD // Your Gmail app password
  }
})

// Send cancellation email to admin
const sendCancellationEmail = async (order, user) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL, // Admin email from env
    subject: `Order Cancelled - #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Order Cancellation Notice</h2>
        
        <div style="background-color: #fee2e2; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; color: #991b1b;">
            <strong>Order #${order._id.toString().slice(-8).toUpperCase()} has been cancelled by the customer.</strong>
          </p>
        </div>
        
        <h3>Order Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Order ID:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">#${order._id.toString().slice(-8).toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Order Date:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${new Date(order.createdAt).toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Cancelled Date:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${new Date().toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Cancel Reason:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${order.cancelReason || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Total Amount:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">₹${order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
        </table>
        
        <h3>Customer Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${order.shippingAddress.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${user.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${order.shippingAddress.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Address:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
              ${order.shippingAddress.address}, ${order.shippingAddress.city}, 
              ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}
            </td>
          </tr>
        </table>
        
        <h3>Order Items:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Product</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb;">Quantity</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                  ${item.product?.name || 'Product'}
                  ${item.isWholesale ? '<span style="color: #ea580c;">(Wholesale)</span>' : ''}
                </td>
                <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">₹${item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">₹${(item.quantity * item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right; border-top: 2px solid #374151;"><strong>Subtotal:</strong></td>
              <td style="padding: 10px; text-align: right; border-top: 2px solid #374151;"><strong>₹${order.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
            </tr>
            ${order.shippingCost > 0 ? `
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
              <td style="padding: 10px; text-align: right;"><strong>₹${order.shippingCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
            </tr>
            ` : ''}
            ${order.tax > 0 ? `
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Tax:</strong></td>
              <td style="padding: 10px; text-align: right;"><strong>₹${order.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
            </tr>
            ` : ''}
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right; border-top: 2px solid #374151;"><strong>Total:</strong></td>
              <td style="padding: 10px; text-align: right; border-top: 2px solid #374151;"><strong>₹${order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
            </tr>
          </tfoot>
        </table>
        
        <h3>Payment Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Payment Method:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-transform: uppercase;">${order.paymentMethod}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Payment Status:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-transform: capitalize;">${order.paymentStatus}</td>
          </tr>
          ${order.paymentId ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Payment ID:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${order.paymentId}</td>
          </tr>
          ` : ''}
          ${order.upiId ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>UPI ID:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${order.upiId}</td>
          </tr>
          ` : ''}
        </table>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #f9fafb; border-radius: 5px;">
          <p style="margin: 0; font-size: 12px; color: #6b7280;">
            This is an automated notification from your e-commerce system.
          </p>
        </div>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Cancellation email sent to admin')
  } catch (error) {
    console.error('Error sending cancellation email:', error)
  }
}

// Send cancellation confirmation email to customer
const sendCustomerCancellationEmail = async (order, userEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Order Cancelled - #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Order Cancellation Confirmation</h2>
        
        <p>Dear ${order.shippingAddress.fullName},</p>
        
        <p>Your order has been successfully cancelled as per your request.</p>
        
        <div style="background-color: #fee2e2; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; color: #991b1b;">
            <strong>Order #${order._id.toString().slice(-8).toUpperCase()}</strong>
          </p>
          <p style="margin: 5px 0 0 0; color: #991b1b;">
            Cancelled on: ${new Date().toLocaleString('en-IN')}
          </p>
          ${order.cancelReason ? `<p style="margin: 5px 0 0 0; color: #991b1b;">Reason: ${order.cancelReason}</p>` : ''}
        </div>
        
        <h3>Order Summary:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${order.items.map(item => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
                ${item.product?.name || 'Product'} x ${item.quantity}
                ${item.isWholesale ? '<span style="color: #ea580c;"> (Wholesale)</span>' : ''}
              </td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                ₹${(item.quantity * item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          `).join('')}
          <tr>
            <td style="padding: 12px 8px; border-top: 2px solid #374151;"><strong>Total</strong></td>
            <td style="padding: 12px 8px; border-top: 2px solid #374151; text-align: right;"><strong>₹${order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-radius: 5px;">
          <p style="margin: 0; color: #1e40af;">
            <strong>Refund Information:</strong><br>
            ${order.paymentStatus === 'paid' 
              ? 'Your refund will be processed within 5-7 business days and credited to your original payment method.' 
              : 'Since this order was not yet paid, no refund is necessary.'}
          </p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 5px;">
          <h4 style="margin: 0 0 10px 0;">Shipping Address (Cancelled):</h4>
          <p style="margin: 0; color: #4b5563;">
            ${order.shippingAddress.fullName}<br>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}<br>
            ${order.shippingAddress.country}<br>
            Phone: ${order.shippingAddress.phone}
          </p>
        </div>
        
        <p style="margin-top: 20px;">
          If you have any questions about this cancellation, please don't hesitate to contact our customer support.
        </p>
        
        <p>Thank you for your understanding!</p>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #f9fafb; border-radius: 5px;">
          <p style="margin: 0; font-size: 12px; color: #6b7280;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Cancellation confirmation email sent to customer')
  } catch (error) {
    console.error('Error sending customer email:', error)
  }
}

// Create new order
router.post('/', auth, [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
  body('shippingAddress.fullName').trim().notEmpty().withMessage('Full name is required'),
  body('shippingAddress.address').trim().notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').trim().notEmpty().withMessage('ZIP code is required'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Phone number is required'),
  body('paymentMethod').isIn(['razorpay', 'card', 'upi', 'phonepe', 'googlepay', 'paytm', 'netbanking', 'wallet']).withMessage('Invalid payment method'),
  body('subtotal').isFloat({ min: 0 }).withMessage('Subtotal must be non-negative'),
  body('total').isFloat({ min: 0 }).withMessage('Total must be non-negative')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const { items, shippingAddress, paymentMethod, subtotal, total, notes, orderType } = req.body

    // Verify products exist and have sufficient stock
    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` })
      }
      if (!product.isActive) {
        return res.status(400).json({ message: `Product is no longer available: ${product.name}` })
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        })
      }
    }

    // Create order
    const order = new Order({
      user: req.user.userId,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'upi',
      subtotal,
      tax: 0, // No GST
      total,
      notes,
      orderType: orderType || 'regular',
      currency: 'INR'
    })

    await order.save()

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      )
    }

    // Populate product details
    await order.populate('items.product', 'name image price size')

    res.status(201).json({ message: 'Order created successfully', order })
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({ message: 'Server error while creating order' })
  }
})

// Get user orders
router.get('/user', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const { page = 1, limit = 10, status } = req.query

    // Build filter
    const filter = { user: req.user.userId }
    if (status) {
      filter.status = status
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const orders = await Order.find(filter)
      .populate('items.product', 'name image price size')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Order.countDocuments(filter)
    const totalPages = Math.ceil(total / parseInt(limit))

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOrders: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    })
  } catch (error) {
    console.error('Get user orders error:', error)
    res.status(500).json({ message: 'Server error while fetching orders' })
  }
})

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name image price size')
      .populate('user', 'name email')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.json({ order })
  } catch (error) {
    console.error('Get order error:', error)
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.status(500).json({ message: 'Server error while fetching order' })
  }
})

// Cancel order
router.patch('/:id/cancel', auth, [
  body('reason').optional().trim().isLength({ max: 200 }).withMessage('Cancel reason cannot exceed 200 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name image price size')
      
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    // Check if order can be cancelled
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' })
    }

    // Update order status
    order.status = 'cancelled'
    order.cancelledAt = new Date()
    order.cancelReason = req.body.reason || 'Cancelled by user'
    await order.save()

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: item.quantity } }
      )
    }

    // Get user details for email
    const user = await User.findById(req.user.userId)
    
    // Send emails (don't wait for them to complete)
    if (user && user.email) {
      sendCancellationEmail(order, user).catch(err => 
        console.error('Email sending failed:', err)
      )
      sendCustomerCancellationEmail(order, user.email).catch(err => 
        console.error('Customer email sending failed:', err)
      )
    }

    res.json({ message: 'Order cancelled successfully', order })
  } catch (error) {
    console.error('Cancel order error:', error)
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.status(500).json({ message: 'Server error while cancelling order' })
  }
})

// Admin: Get all orders
router.get('/admin/all', adminAuth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
  query('paymentStatus').optional().isIn(['pending', 'paid', 'failed', 'refunded']).withMessage('Invalid payment status')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const { page = 1, limit = 20, status, paymentStatus, search } = req.query

    // Build filter
    const filter = {}
    if (status) filter.status = status
    if (paymentStatus) filter.paymentStatus = paymentStatus

    if (search) {
      filter.$or = [
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.email': { $regex: search, $options: 'i' } }
      ]
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name image price')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Order.countDocuments(filter)
    const totalPages = Math.ceil(total / parseInt(limit))

    // Calculate statistics - Only include paid orders in revenue
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { 
            $sum: { 
              $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$total', 0] 
            } 
          },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          processingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
          }
        }
      }
    ])

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOrders: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      },
      stats: stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        processingOrders: 0
      }
    })
  } catch (error) {
    console.error('Get admin orders error:', error)
    res.status(500).json({ message: 'Server error while fetching orders' })
  }
})

// Admin: Update order status
router.patch('/admin/:id/status', adminAuth, [
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
  body('trackingNumber').optional().trim().isLength({ max: 50 }).withMessage('Tracking number cannot exceed 50 characters'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const { status, trackingNumber, notes } = req.body

    const updateData = { status }
    if (trackingNumber) updateData.trackingNumber = trackingNumber
    if (notes) updateData.notes = notes

    if (status === 'delivered') {
      updateData.deliveredAt = new Date()
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email')
     .populate('items.product', 'name image price')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json({ message: 'Order status updated successfully', order })
  } catch (error) {
    console.error('Update order status error:', error)
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.status(500).json({ message: 'Server error while updating order status' })
  }
})

export default router