// import Order from "../models/Order.js"
// import {  sendCustomerOrderCancellationEmail, 
//   sendAdminOrderCancellationNotification } from "../utils/email.js"

// export const cancelOrder = async (req, res) => {
//   try {
//     const { id } = req.params
//     const { reason } = req.body
//     const userId = req.user.id // Assuming you have auth middleware

//     // Find the order
//     const order = await Order.findById(id).populate('items.product')

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' })
//     }

//     // Check if user owns this order
//     if (order.user.toString() !== userId) {
//       return res.status(403).json({ message: 'Unauthorized to cancel this order' })
//     }

//     // Check if order can be cancelled (only pending or processing)
//     if (order.status !== 'pending' && order.status !== 'processing') {
//       return res.status(400).json({ 
//         message: `Cannot cancel order with status: ${order.status}` 
//       })
//     }

//     // Update order status
//     order.status = 'cancelled'
//     order.cancelledAt = new Date()
//     order.cancelReason = reason || 'Cancelled by user'
    
//     await order.save()

//     // Prepare order data for emails
//     const orderData = {
//       _id: order._id,
//       orderNumber: order.orderNumber || order._id.toString().slice(-8).toUpperCase(),
//       customerName: order.user?.name || order.shippingAddress?.fullName || 'Customer',
//       customerEmail: order.user?.email || req.user.email,
//       total: order.total,
//       items: order.items,
//       shippingAddress: order.shippingAddress,
//       paymentMethod: order.paymentMethod,
//       paymentStatus: order.paymentStatus,
//       paymentId: order.paymentId,
//       upiId: order.upiId,
//       createdAt: order.createdAt,
//       cancelledAt: order.cancelledAt,
//       cancelReason: order.cancelReason
//     }

//     // Send cancellation emails (run in background, don't wait)
//     Promise.all([
//       // Send email to customer
//       sendCustomerOrderCancellationEmail(orderData.customerEmail, orderData)
//         .catch(err => console.error('Failed to send customer cancellation email:', err)),
      
//       // Send notification to admin
//       sendAdminOrderCancellationNotification(orderData)
//         .catch(err => console.error('Failed to send admin cancellation notification:', err))
//     ])

//     res.status(200).json({
//       success: true,
//       message: 'Order cancelled successfully. Cancellation emails have been sent.',
//       order
//     })

//   } catch (error) {
//     console.error('Error cancelling order:', error)
//     res.status(500).json({ 
//       message: 'Failed to cancel order', 
//       error: error.message 
//     })
//   }
// }

// // ============================================
// // ALTERNATIVE: If you prefer to wait for emails
// // ============================================

// // If you want to ensure emails are sent before responding:

// export const cancelOrderWithEmailWait = async (req, res) => {
//   try {
//     const { id } = req.params
//     const { reason } = req.body
//     const userId = req.user.id

//     const order = await Order.findById(id).populate('items.product')

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' })
//     }

//     if (order.user.toString() !== userId) {
//       return res.status(403).json({ message: 'Unauthorized to cancel this order' })
//     }

//     if (order.status !== 'pending' && order.status !== 'processing') {
//       return res.status(400).json({ 
//         message: `Cannot cancel order with status: ${order.status}` 
//       })
//     }

//     order.status = 'cancelled'
//     order.cancelledAt = new Date()
//     order.cancelReason = reason || 'Cancelled by user'
    
//     await order.save()

//     const orderData = {
//       _id: order._id,
//       orderNumber: order.orderNumber || order._id.toString().slice(-8).toUpperCase(),
//       customerName: order.user?.name || order.shippingAddress?.fullName || 'Customer',
//       customerEmail: order.user?.email || req.user.email,
//       total: order.total,
//       items: order.items,
//       shippingAddress: order.shippingAddress,
//       paymentMethod: order.paymentMethod,
//       paymentStatus: order.paymentStatus,
//       paymentId: order.paymentId,
//       upiId: order.upiId,
//       createdAt: order.createdAt,
//       cancelledAt: order.cancelledAt,
//       cancelReason: order.cancelReason
//     }

//     // Wait for emails to be sent
//     try {
//       await Promise.all([
//         sendCustomerOrderCancellationEmail(orderData.customerEmail, orderData),
//         sendAdminOrderCancellationNotification(orderData)
//       ])
      
//       res.status(200).json({
//         success: true,
//         message: 'Order cancelled successfully and notification emails sent.',
//         order
//       })
//     } catch (emailError) {
//       console.error('Email sending failed:', emailError)
//       // Order is still cancelled, but emails failed
//       res.status(200).json({
//         success: true,
//         message: 'Order cancelled successfully but email notifications failed.',
//         order
//       })
//     }

//   } catch (error) {
//     console.error('Error cancelling order:', error)
//     res.status(500).json({ 
//       message: 'Failed to cancel order', 
//       error: error.message 
//     })
//   }
// }

// // ============================================
// // ENVIRONMENT VARIABLES NEEDED
// // ============================================

// // Make sure you have these in your .env file:

// /*
// EMAIL_HOST=smtp.gmail.com
// EMAIL_PORT=587
// EMAIL_USER=your-email@gmail.com
// EMAIL_PASS=your-app-password
// ADMIN_EMAIL=admin@bluesip.com
// */

// // ============================================
// // NOTES
// // ============================================

// /*
// 1. The first approach (Promise.all without await) is better for user experience
//    - Returns response immediately
//    - Emails are sent in background
//    - User doesn't wait for email delivery

// 2. The second approach (with await) ensures emails are sent
//    - User waits for confirmation
//    - Better error handling for emails
//    - Slower response time

// 3. Make sure your Order model has these fields:
//    - status
//    - cancelledAt (Date)
//    - cancelReason (String)
//    - orderNumber (String)
//    - All other fields used in orderData

// 4. The emails will show:
//    - Customer Email: Cancellation confirmation with refund info
//    - Admin Email: Notification with required actions and refund reminder

// 5. Email styling matches your existing Blue Sip brand guidelines
// */






import Order from '../models/Order.js'
import {
  sendCustomerOrderCancellationEmail,
  sendAdminOrderCancellationNotification
} from '../utils/email.js'

export const cancelOrder = async (req, res) => {
  try {

    const { id } = req.params
    const { cancelReason } = req.body

    const order = await Order.findById(id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Security check
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order already cancelled' })
    }

    // Update order
    order.status = 'cancelled'
    order.cancelReason = cancelReason || ''
    order.cancelledAt = new Date()

    await order.save()

    // ✅ SEND EMAILS AFTER SUCCESSFUL CANCEL
    await sendCustomerOrderCancellationEmail(order.customerEmail, order)
    await sendAdminOrderCancellationNotification(order)

    res.json({
      success: true,
      message: 'Order cancelled successfully & emails sent'
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
