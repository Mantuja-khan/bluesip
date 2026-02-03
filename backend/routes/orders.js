// // import express from 'express'
// // import { body, query, validationResult } from 'express-validator'
// // import Order from '../models/Order.js'
// // import Product from '../models/Product.js'
// // import { auth, adminAuth } from '../middleware/auth.js'

// // const router = express.Router()

// // // Create new order
// // router.post('/', auth, [
// //   body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
// //   body('items.*.product').isMongoId().withMessage('Invalid product ID'),
// //   body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
// //   body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
// //   body('shippingAddress.fullName').trim().notEmpty().withMessage('Full name is required'),
// //   body('shippingAddress.address').trim().notEmpty().withMessage('Address is required'),
// //   body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
// //   body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
// //   body('shippingAddress.zipCode').trim().notEmpty().withMessage('ZIP code is required'),
// //   body('shippingAddress.phone').trim().notEmpty().withMessage('Phone number is required'),
// //   body('paymentMethod').isIn(['razorpay', 'card', 'upi', 'phonepe', 'googlepay', 'paytm', 'netbanking']).withMessage('Invalid payment method'),
// //   body('subtotal').isFloat({ min: 0 }).withMessage('Subtotal must be non-negative'),
// //   body('total').isFloat({ min: 0 }).withMessage('Total must be non-negative')
// // ], async (req, res) => {
// //   try {
// //     const errors = validationResult(req)
// //     if (!errors.isEmpty()) {
// //       return res.status(400).json({ message: errors.array()[0].msg })
// //     }

// //     const { items, shippingAddress, paymentMethod, subtotal, total, notes, orderType } = req.body

// //     // Verify products exist and have sufficient stock
// //     for (const item of items) {
// //       const product = await Product.findById(item.product)
// //       if (!product) {
// //         return res.status(404).json({ message: `Product not found: ${item.product}` })
// //       }
// //       if (!product.isActive) {
// //         return res.status(400).json({ message: `Product is no longer available: ${product.name}` })
// //       }
// //       if (product.stock < item.quantity) {
// //         return res.status(400).json({ 
// //           message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
// //         })
// //       }
// //     }

// //     // Create order
// //     const order = new Order({
// //       user: req.user.userId,
// //       items,
// //       shippingAddress,
// //       paymentMethod: paymentMethod || 'razorpay',
// //       subtotal,
// //       tax: 0, // No GST
// //       total,
// //       notes,
// //       orderType: orderType || 'regular',
// //       currency: 'INR'
// //     })

// //     await order.save()

// //     // Update product stock
// //     for (const item of items) {
// //       await Product.findByIdAndUpdate(
// //         item.product,
// //         { $inc: { stock: -item.quantity } }
// //       )
// //     }

// //     // Populate product details
// //     await order.populate('items.product', 'name image price size')

// //     res.status(201).json({ message: 'Order created successfully', order })
// //   } catch (error) {
// //     console.error('Create order error:', error)
// //     res.status(500).json({ message: 'Server error while creating order' })
// //   }
// // })

// // // Get user orders
// // router.get('/user', auth, [
// //   query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
// //   query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
// //   query('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status')
// // ], async (req, res) => {
// //   try {
// //     const errors = validationResult(req)
// //     if (!errors.isEmpty()) {
// //       return res.status(400).json({ message: errors.array()[0].msg })
// //     }

// //     const { page = 1, limit = 10, status } = req.query

// //     // Build filter
// //     const filter = { user: req.user.userId }
// //     if (status) {
// //       filter.status = status
// //     }

// //     // Execute query with pagination
// //     const skip = (parseInt(page) - 1) * parseInt(limit)
// //     const orders = await Order.find(filter)
// //       .populate('items.product', 'name image price size')
// //       .sort('-createdAt')
// //       .skip(skip)
// //       .limit(parseInt(limit))

// //     const total = await Order.countDocuments(filter)
// //     const totalPages = Math.ceil(total / parseInt(limit))

// //     res.json({
// //       orders,
// //       pagination: {
// //         currentPage: parseInt(page),
// //         totalPages,
// //         totalOrders: total,
// //         hasNextPage: parseInt(page) < totalPages,
// //         hasPrevPage: parseInt(page) > 1
// //       }
// //     })
// //   } catch (error) {
// //     console.error('Get user orders error:', error)
// //     res.status(500).json({ message: 'Server error while fetching orders' })
// //   }
// // })

// // // Get single order
// // router.get('/:id', auth, async (req, res) => {
// //   try {
// //     const order = await Order.findById(req.params.id)
// //       .populate('items.product', 'name image price size')
// //       .populate('user', 'name email')

// //     if (!order) {
// //       return res.status(404).json({ message: 'Order not found' })
// //     }

// //     // Check if user owns the order or is admin
// //     if (order.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
// //       return res.status(403).json({ message: 'Access denied' })
// //     }

// //     res.json({ order })
// //   } catch (error) {
// //     console.error('Get order error:', error)
// //     if (error.name === 'CastError') {
// //       return res.status(404).json({ message: 'Order not found' })
// //     }
// //     res.status(500).json({ message: 'Server error while fetching order' })
// //   }
// // })

// // // Cancel order
// // router.patch('/:id/cancel', auth, [
// //   body('reason').optional().trim().isLength({ max: 200 }).withMessage('Cancel reason cannot exceed 200 characters')
// // ], async (req, res) => {
// //   try {
// //     const errors = validationResult(req)
// //     if (!errors.isEmpty()) {
// //       return res.status(400).json({ message: errors.array()[0].msg })
// //     }

// //     const order = await Order.findById(req.params.id)
// //     if (!order) {
// //       return res.status(404).json({ message: 'Order not found' })
// //     }

// //     // Check if user owns the order
// //     if (order.user.toString() !== req.user.userId) {
// //       return res.status(403).json({ message: 'Access denied' })
// //     }

// //     // Check if order can be cancelled
// //     if (!['pending', 'processing'].includes(order.status)) {
// //       return res.status(400).json({ message: 'Order cannot be cancelled at this stage' })
// //     }

// //     // Update order status
// //     order.status = 'cancelled'
// //     order.cancelledAt = new Date()
// //     order.cancelReason = req.body.reason || 'Cancelled by user'
// //     await order.save()

// //     // Restore product stock
// //     for (const item of order.items) {
// //       await Product.findByIdAndUpdate(
// //         item.product,
// //         { $inc: { stock: item.quantity } }
// //       )
// //     }

// //     res.json({ message: 'Order cancelled successfully', order })
// //   } catch (error) {
// //     console.error('Cancel order error:', error)
// //     if (error.name === 'CastError') {
// //       return res.status(404).json({ message: 'Order not found' })
// //     }
// //     res.status(500).json({ message: 'Server error while cancelling order' })
// //   }
// // })

// // // Admin: Get all orders
// // router.get('/admin/all', adminAuth, [
// //   query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
// //   query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
// //   query('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
// //   query('paymentStatus').optional().isIn(['pending', 'paid', 'failed', 'refunded']).withMessage('Invalid payment status')
// // ], async (req, res) => {
// //   try {
// //     const errors = validationResult(req)
// //     if (!errors.isEmpty()) {
// //       return res.status(400).json({ message: errors.array()[0].msg })
// //     }

// //     const { page = 1, limit = 20, status, paymentStatus, search } = req.query

// //     // Build filter
// //     const filter = {}
// //     if (status) filter.status = status
// //     if (paymentStatus) filter.paymentStatus = paymentStatus

// //     if (search) {
// //       filter.$or = [
// //         { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
// //         { 'shippingAddress.email': { $regex: search, $options: 'i' } }
// //       ]
// //     }

// //     // Execute query with pagination
// //     const skip = (parseInt(page) - 1) * parseInt(limit)
// //     const orders = await Order.find(filter)
// //       .populate('user', 'name email')
// //       .populate('items.product', 'name image price')
// //       .sort('-createdAt')
// //       .skip(skip)
// //       .limit(parseInt(limit))

// //     const total = await Order.countDocuments(filter)
// //     const totalPages = Math.ceil(total / parseInt(limit))

// //     // Calculate statistics - Only include paid orders in revenue
// //     const stats = await Order.aggregate([
// //       {
// //         $group: {
// //           _id: null,
// //           totalOrders: { $sum: 1 },
// //           totalRevenue: { 
// //             $sum: { 
// //               $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$total', 0] 
// //             } 
// //           },
// //           pendingOrders: {
// //             $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
// //           },
// //           processingOrders: {
// //             $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
// //           }
// //         }
// //       }
// //     ])

// //     res.json({
// //       orders,
// //       pagination: {
// //         currentPage: parseInt(page),
// //         totalPages,
// //         totalOrders: total,
// //         hasNextPage: parseInt(page) < totalPages,
// //         hasPrevPage: parseInt(page) > 1
// //       },
// //       stats: stats[0] || {
// //         totalOrders: 0,
// //         totalRevenue: 0,
// //         pendingOrders: 0,
// //         processingOrders: 0
// //       }
// //     })
// //   } catch (error) {
// //     console.error('Get admin orders error:', error)
// //     res.status(500).json({ message: 'Server error while fetching orders' })
// //   }
// // })

// // // Admin: Update order status
// // router.patch('/admin/:id/status', adminAuth, [
// //   body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
// //   body('trackingNumber').optional().trim().isLength({ max: 50 }).withMessage('Tracking number cannot exceed 50 characters'),
// //   body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
// // ], async (req, res) => {
// //   try {
// //     const errors = validationResult(req)
// //     if (!errors.isEmpty()) {
// //       return res.status(400).json({ message: errors.array()[0].msg })
// //     }

// //     const { status, trackingNumber, notes } = req.body

// //     const updateData = { status }
// //     if (trackingNumber) updateData.trackingNumber = trackingNumber
// //     if (notes) updateData.notes = notes

// //     if (status === 'delivered') {
// //       updateData.deliveredAt = new Date()
// //     }

// //     const order = await Order.findByIdAndUpdate(
// //       req.params.id,
// //       updateData,
// //       { new: true, runValidators: true }
// //     ).populate('user', 'name email')
// //      .populate('items.product', 'name image price')

// //     if (!order) {
// //       return res.status(404).json({ message: 'Order not found' })
// //     }

// //     res.json({ message: 'Order status updated successfully', order })
// //   } catch (error) {
// //     console.error('Update order status error:', error)
// //     if (error.name === 'CastError') {
// //       return res.status(404).json({ message: 'Order not found' })
// //     }
// //     res.status(500).json({ message: 'Server error while updating order status' })
// //   }
// // })

// // export default router
















// import React, { useState, useEffect } from 'react'
// import { Package, Calendar, DollarSign, Truck, CheckCircle, XCircle, Clock, X, MapPin, Phone, Mail, User, AlertCircle } from 'lucide-react'
// import { toast } from 'react-toastify'
// import axios from 'axios'

// const API_URL = 'http://localhost:5000/api'

// const Orders = () => {
//   const [orders, setOrders] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [selectedFilter, setSelectedFilter] = useState('all')
//   const [selectedOrder, setSelectedOrder] = useState(null)
//   const [showDetailsModal, setShowDetailsModal] = useState(false)
//   const [showCancelModal, setShowCancelModal] = useState(false)
//   const [cancelLoading, setCancelLoading] = useState(false)
//   const [cancelReason, setCancelReason] = useState('')
//   const [orderToCancel, setOrderToCancel] = useState(null)

//   useEffect(() => {
//     fetchOrders()
//   }, [])

//   const fetchOrders = async () => {
//     try {
//       const token = localStorage.getItem('token')
//       const response = await axios.get(`${API_URL}/orders/user`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       })
//       setOrders(response.data.orders)
//     } catch (error) {
//       console.error('Error fetching orders:', error)
//       toast.error(error.response?.data?.message || 'Failed to load orders')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleViewDetails = (order) => {
//     setSelectedOrder(order)
//     setShowDetailsModal(true)
//   }

//   const openCancelModal = (order) => {
//     setOrderToCancel(order)
//     setShowCancelModal(true)
//     setCancelReason('')
//   }

//   const closeCancelModal = () => {
//     setShowCancelModal(false)
//     setOrderToCancel(null)
//     setCancelReason('')
//   }

//   const confirmCancelOrder = async () => {
//     if (!orderToCancel) return

//     setCancelLoading(true)
//     try {
//       const token = localStorage.getItem('token')
//       const response = await axios.patch(
//         `${API_URL}/orders/${orderToCancel._id}/cancel`,
//         { reason: cancelReason || 'Cancelled by user' },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       )

//       toast.success(response.data.message || 'Order cancelled successfully! Email notifications sent to you and admin.')
      
//       // Update orders list
//       setOrders(orders.map(order => 
//         order._id === orderToCancel._id 
//           ? { ...order, status: 'cancelled', cancelledAt: new Date(), cancelReason: cancelReason || 'Cancelled by user' }
//           : order
//       ))

//       // Update selected order if modal is open
//       if (selectedOrder && selectedOrder._id === orderToCancel._id) {
//         setSelectedOrder({ 
//           ...selectedOrder, 
//           status: 'cancelled', 
//           cancelledAt: new Date(),
//           cancelReason: cancelReason || 'Cancelled by user'
//         })
//       }
      
//       closeCancelModal()
//       setShowDetailsModal(false)
//     } catch (error) {
//       console.error('Error cancelling order:', error)
//       toast.error(error.response?.data?.message || 'Failed to cancel order')
//     } finally {
//       setCancelLoading(false)
//     }
//   }

//   const handleReorder = async (order) => {
//     try {
//       const token = localStorage.getItem('token')
      
//       // Add each item from the order to cart
//       for (const item of order.items) {
//         if (item.product) {
//           await axios.post(
//             `${API_URL}/cart`,
//             {
//               productId: item.product._id,
//               quantity: item.quantity,
//               isWholesale: item.isWholesale || false
//             },
//             {
//               headers: {
//                 'Authorization': `Bearer ${token}`
//               }
//             }
//           )
//         }
//       }

//       toast.success('Items added to cart successfully!')
      
//       // Redirect to cart after a short delay
//       setTimeout(() => {
//         window.location.href = '/cart'
//       }, 1000)
//     } catch (error) {
//       console.error('Error reordering:', error)
//       toast.error(error.response?.data?.message || 'Failed to add items to cart')
//     }
//   }

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'pending':
//         return <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
//       case 'processing':
//         return <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
//       case 'shipped':
//         return <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
//       case 'delivered':
//         return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
//       case 'cancelled':
//         return <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
//       default:
//         return <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
//     }
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800'
//       case 'processing':
//         return 'bg-blue-100 text-blue-800'
//       case 'shipped':
//         return 'bg-purple-100 text-purple-800'
//       case 'delivered':
//         return 'bg-green-100 text-green-800'
//       case 'cancelled':
//         return 'bg-red-100 text-red-800'
//       default:
//         return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const filteredOrders = orders.filter(order => {
//     if (selectedFilter === 'all') return true
//     return order.status === selectedFilter
//   })

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center pb-20 lg:pb-8">
//         <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 border-b-2 border-blue-600"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 pb-20 lg:pb-8">
//       <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
//         <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">My Orders</h1>

//         {/* Filter Tabs */}
//         <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6">
//           <div className="border-b border-gray-200">
//             <nav className="flex space-x-4 sm:space-x-8 px-3 sm:px-6 overflow-x-auto" aria-label="Tabs">
//               {[
//                 { key: 'all', label: 'All Orders', count: orders.length },
//                 { key: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
//                 { key: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
//                 { key: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
//                 { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length }
//               ].map((tab) => (
//                 <button
//                   key={tab.key}
//                   onClick={() => setSelectedFilter(tab.key)}
//                   className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
//                     selectedFilter === tab.key
//                       ? 'border-blue-500 text-blue-600'
//                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//                 >
//                   {tab.label} ({tab.count})
//                 </button>
//               ))}
//             </nav>
//           </div>
//         </div>

//         {/* Orders List */}
//         {filteredOrders.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
//             <Package className="mx-auto h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 text-gray-400 mb-4" />
//             <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
//               {selectedFilter === 'all' ? 'No orders yet' : `No ${selectedFilter} orders`}
//             </h3>
//             <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
//               {selectedFilter === 'all' 
//                 ? "You haven't placed any orders yet. Start shopping to see your orders here!"
//                 : `You don't have any ${selectedFilter} orders at the moment.`
//               }
//             </p>
//             {selectedFilter === 'all' && (
//               <a href="/products" className="btn-primary text-sm sm:text-base">
//                 Start Shopping
//               </a>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-4 sm:space-y-6">
//             {filteredOrders.map((order) => (
//               <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
//                 {/* Order Header */}
//                 <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
//                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
//                     <div className="flex items-center space-x-3 sm:space-x-4">
//                       <div>
//                         <p className="text-sm font-medium text-gray-900">
//                           Order #{order._id.slice(-8).toUpperCase()}
//                         </p>
//                         <div className="flex items-center space-x-2 mt-1">
//                           <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
//                           <p className="text-xs sm:text-sm text-gray-600">
//                             {new Date(order.createdAt).toLocaleDateString('en-IN')}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3 sm:space-x-4">
//                       <div className="flex items-center space-x-2">
//                         <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
//                         <span className="font-semibold text-gray-900 text-sm sm:text-base">
//                           ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                         </span>
//                       </div>
//                       <div className={`flex items-center space-x-2 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                         {getStatusIcon(order.status)}
//                         <span className="capitalize">{order.status}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Order Items */}
//                 <div className="px-4 sm:px-6 py-3 sm:py-4">
//                   <div className="space-y-3 sm:space-y-4">
//                     {order.items.map((item, index) => (
//                       <div key={index} className="flex items-center space-x-3 sm:space-x-4">
//                         <img
//                           src={item.product?.image || 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=100'}
//                           alt={item.product?.name || 'Product'}
//                           className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
//                         />
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium text-gray-900 truncate">
//                             {item.product?.name || 'Product'}
//                           </p>
//                           <p className="text-xs sm:text-sm text-gray-600">
//                             Quantity: {item.quantity} × ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                             {item.isWholesale && <span className="text-orange-600 ml-1">(Wholesale)</span>}
//                           </p>
//                         </div>
//                         <div className="text-sm font-medium text-gray-900">
//                           ₹{(item.quantity * item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Order Footer */}
//                 <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50">
//                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
//                     <div className="text-xs sm:text-sm text-gray-600">
//                       <p>Shipping to: {order.shippingAddress?.fullName}</p>
//                       <p>{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
//                     </div>
//                     <div className="flex space-x-2 sm:space-x-3">
//                       <button 
//                         onClick={() => handleViewDetails(order)}
//                         className="btn-secondary text-xs sm:text-sm px-3 py-2"
//                       >
//                         View Details
//                       </button>
                      
//                       {(order.status === 'pending' || order.status === 'processing') && (
//                         <button 
//                           onClick={() => openCancelModal(order)}
//                           disabled={cancelLoading}
//                           className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium px-3 py-2 disabled:opacity-50"
//                         >
//                           Cancel Order
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Cancel Confirmation Modal */}
//       {showCancelModal && orderToCancel && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg max-w-md w-full">
//             <div className="p-6">
//               {/* Warning Icon */}
//               <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
//                 <AlertCircle className="h-6 w-6 text-red-600" />
//               </div>

//               {/* Title */}
//               <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
//                 Cancel Order?
//               </h3>

//               {/* Message */}
//               <p className="text-sm text-gray-600 text-center mb-4">
//                 Are you sure you want to cancel order <strong>#{orderToCancel._id.slice(-8).toUpperCase()}</strong>?
//               </p>

//               {/* Order Details */}
//               <div className="bg-gray-50 rounded-lg p-4 mb-4">
//                 <div className="flex justify-between text-sm mb-2">
//                   <span className="text-gray-600">Order Total:</span>
//                   <span className="font-semibold text-gray-900">
//                     ₹{orderToCancel.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Items:</span>
//                   <span className="text-gray-900">{orderToCancel.items.length}</span>
//                 </div>
//               </div>

//               {/* Cancel Reason */}
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Reason for cancellation (optional)
//                 </label>
//                 <textarea
//                   value={cancelReason}
//                   onChange={(e) => setCancelReason(e.target.value)}
//                   placeholder="Please provide a reason..."
//                   maxLength={200}
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   {cancelReason.length}/200 characters
//                 </p>
//               </div>

//               {/* Info Message */}
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
//                 <p className="text-xs text-blue-800">
//                   <strong>Note:</strong> Email notifications will be sent to you and our admin team. 
//                   {orderToCancel.paymentStatus === 'paid' && ' Refund will be processed within 5-7 business days.'}
//                 </p>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex space-x-3">
//                 <button
//                   onClick={closeCancelModal}
//                   disabled={cancelLoading}
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
//                 >
//                   No, Keep Order
//                 </button>
//                 <button
//                   onClick={confirmCancelOrder}
//                   disabled={cancelLoading}
//                   className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {cancelLoading ? 'Cancelling...' : 'Yes, Cancel Order'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Order Details Modal */}
//       {showDetailsModal && selectedOrder && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             {/* Modal Header */}
//             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//               <h2 className="text-xl font-bold text-gray-900">
//                 Order Details #{selectedOrder._id.slice(-8).toUpperCase()}
//               </h2>
//               <button
//                 onClick={() => setShowDetailsModal(false)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6 space-y-6">
//               {/* Order Status */}
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">Order Status</p>
//                     <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
//                       {getStatusIcon(selectedOrder.status)}
//                       <span className="capitalize">{selectedOrder.status}</span>
//                     </div>
//                     {selectedOrder.cancelReason && (
//                       <p className="text-sm text-red-600 mt-2">
//                         Cancel Reason: {selectedOrder.cancelReason}
//                       </p>
//                     )}
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm text-gray-600 mb-1">Order Date</p>
//                     <p className="text-sm font-medium text-gray-900">
//                       {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
//                     </p>
//                     {selectedOrder.cancelledAt && (
//                       <>
//                         <p className="text-sm text-gray-600 mb-1 mt-2">Cancelled Date</p>
//                         <p className="text-sm font-medium text-red-600">
//                           {new Date(selectedOrder.cancelledAt).toLocaleString('en-IN')}
//                         </p>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Shipping Address */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
//                   <MapPin className="h-5 w-5 mr-2 text-blue-600" />
//                   Shipping Address
//                 </h3>
//                 <div className="bg-gray-50 rounded-lg p-4 space-y-2">
//                   <div className="flex items-center space-x-2">
//                     <User className="h-4 w-4 text-gray-400" />
//                     <p className="text-sm font-medium text-gray-900">
//                       {selectedOrder.shippingAddress?.fullName}
//                     </p>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Phone className="h-4 w-4 text-gray-400" />
//                     <p className="text-sm text-gray-600">
//                       {selectedOrder.shippingAddress?.phone}
//                     </p>
//                   </div>
//                   <p className="text-sm text-gray-600 ml-6">
//                     {selectedOrder.shippingAddress?.address}
//                   </p>
//                   <p className="text-sm text-gray-600 ml-6">
//                     {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.zipCode}
//                   </p>
//                   <p className="text-sm text-gray-600 ml-6">
//                     {selectedOrder.shippingAddress?.country}
//                   </p>
//                 </div>
//               </div>

//               {/* Order Items */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
//                   <Package className="h-5 w-5 mr-2 text-blue-600" />
//                   Order Items
//                 </h3>
//                 <div className="bg-gray-50 rounded-lg p-4 space-y-4">
//                   {selectedOrder.items.map((item, index) => (
//                     <div key={index} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
//                       <img
//                         src={item.product?.image || 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=150'}
//                         alt={item.product?.name || 'Product'}
//                         className="w-20 h-20 object-cover rounded-lg"
//                       />
//                       <div className="flex-1">
//                         <p className="text-sm font-medium text-gray-900">
//                           {item.product?.name || 'Product'}
//                         </p>
//                         {item.product?.size && (
//                           <p className="text-sm text-gray-600 mt-1">
//                             Size: {item.product.size}
//                           </p>
//                         )}
//                         <div className="flex items-center space-x-4 mt-2">
//                           <p className="text-sm text-gray-600">
//                             Quantity: {item.quantity}
//                           </p>
//                           <p className="text-sm text-gray-600">
//                             Price: ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                           </p>
//                           {item.isWholesale && (
//                             <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
//                               Wholesale
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-sm font-semibold text-gray-900">
//                           ₹{(item.quantity * item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Order Summary */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
//                   <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
//                   Order Summary
//                 </h3>
//                 <div className="bg-gray-50 rounded-lg p-4 space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span className="text-gray-900">
//                       ₹{selectedOrder.subtotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
//                     </span>
//                   </div>
//                   {selectedOrder.shippingCost > 0 && (
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Shipping</span>
//                       <span className="text-gray-900">
//                         ₹{selectedOrder.shippingCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                       </span>
//                     </div>
//                   )}
//                   {selectedOrder.tax > 0 && (
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Tax</span>
//                       <span className="text-gray-900">
//                         ₹{selectedOrder.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                       </span>
//                     </div>
//                   )}
//                   <div className="border-t border-gray-300 pt-2 mt-2">
//                     <div className="flex justify-between">
//                       <span className="text-base font-semibold text-gray-900">Total</span>
//                       <span className="text-lg font-bold text-blue-600">
//                         ₹{selectedOrder.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Information */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
//                 <div className="bg-gray-50 rounded-lg p-4 space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Payment Method</span>
//                     <span className="text-gray-900 capitalize font-medium uppercase">
//                       {selectedOrder.paymentMethod || 'UPI'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Payment Status</span>
//                     <span className={`font-medium ${
//                       selectedOrder.paymentStatus === 'paid' 
//                         ? 'text-green-600' 
//                         : selectedOrder.paymentStatus === 'failed'
//                         ? 'text-red-600'
//                         : 'text-yellow-600'
//                     }`}>
//                       {selectedOrder.paymentStatus === 'paid' ? 'Paid' : 
//                        selectedOrder.paymentStatus === 'failed' ? 'Failed' : 'Pending'}
//                     </span>
//                   </div>
//                   {selectedOrder.paymentId && (
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Payment ID</span>
//                       <span className="text-gray-900 font-mono text-xs">
//                         {selectedOrder.paymentId}
//                       </span>
//                     </div>
//                   )}
//                   {selectedOrder.upiId && (
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">UPI ID</span>
//                       <span className="text-gray-900">
//                         {selectedOrder.upiId}
//                       </span>
//                     </div>
//                   )}
//                   {selectedOrder.trackingNumber && (
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Tracking Number</span>
//                       <span className="text-gray-900 font-mono text-xs">
//                         {selectedOrder.trackingNumber}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Notes */}
//               {selectedOrder.notes && (
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Notes</h3>
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
//                   </div>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex space-x-3 pt-4 border-t border-gray-200">
//                 {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
//                   <button
//                     onClick={() => {
//                       setShowDetailsModal(false)
//                       openCancelModal(selectedOrder)
//                     }}
//                     className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
//                   >
//                     Cancel Order
//                   </button>
//                 )}
//                 {selectedOrder.status === 'delivered' && (
//                   <button
//                     onClick={() => {
//                       handleReorder(selectedOrder)
//                       setShowDetailsModal(false)
//                     }}
//                     className="flex-1 btn-primary"
//                   >
//                     Reorder
//                   </button>
//                 )}
//                 <button
//                   onClick={() => setShowDetailsModal(false)}
//                   className="flex-1 btn-secondary"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Orders








import express from 'express'
import { body, query, validationResult } from 'express-validator'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { auth, adminAuth } from '../middleware/auth.js'
import { sendCustomerOrderCancellationEmail, sendAdminOrderCancellationNotification } from '../utils/email.js'

const router = express.Router()

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
  body('paymentMethod').isIn(['razorpay', 'card', 'upi', 'phonepe', 'googlepay', 'paytm', 'netbanking']).withMessage('Invalid payment method'),
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
      paymentMethod: paymentMethod || 'razorpay',
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

// Cancel order - WITH EMAIL NOTIFICATIONS
router.patch('/:id/cancel', auth, [
  body('reason').optional().trim().isLength({ max: 200 }).withMessage('Cancel reason cannot exceed 200 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    // Find the order and populate product details for email
    const order = await Order.findById(req.params.id).populate('items.product', 'name image price')
    
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
        item.product,
        { $inc: { stock: item.quantity } }
      )
    }

    // Prepare email data
    const emailData = {
      orderNumber: order._id.toString().slice(-8).toUpperCase(),
      customerName: order.shippingAddress.fullName,
      customerEmail: req.user.email, // Make sure your auth middleware provides email
      items: order.items,
      total: order.total,
      cancelledAt: order.cancelledAt,
      cancelReason: order.cancelReason,
      paymentStatus: order.paymentStatus || 'pending',
      shippingAddress: order.shippingAddress
    }

    // Send emails to both customer and admin (don't fail the request if emails fail)
    try {
      await Promise.all([
        sendCustomerOrderCancellationEmail(req.user.email, emailData),
        sendAdminOrderCancellationNotification(emailData)
      ])
      console.log('✅ Cancellation emails sent successfully to customer and admin')
    } catch (emailError) {
      console.error('❌ Error sending cancellation emails:', emailError.message)
      // Don't fail the request - order is already cancelled
    }

    res.json({ 
      message: 'Order cancelled successfully. Email notifications sent to you and admin.', 
      order 
    })
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