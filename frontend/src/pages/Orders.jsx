import React, { useState, useEffect } from 'react'
import { Package, Calendar, DollarSign, Truck, CheckCircle, XCircle, Clock, X, MapPin, Phone, Mail, User } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/orders/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setOrders(response.data.orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error(error.response?.data?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return
    }

    setCancelLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.patch(
        `${API_URL}/orders/${orderId}/cancel`,
        { reason: cancelReason || 'Cancelled by user' },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      toast.success(response.data.message || 'Order cancelled successfully.')
      
      // Update orders list
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: 'cancelled', cancelledAt: new Date(), cancelReason: cancelReason || 'Cancelled by user' }
          : order
      ))

      // Update selected order if modal is open
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ 
          ...selectedOrder, 
          status: 'cancelled', 
          cancelledAt: new Date(),
          cancelReason: cancelReason || 'Cancelled by user'
        })
      }
      
      setCancelReason('')
      setShowDetailsModal(false)
    } catch (error) {
      console.error('Error cancelling order:', error)
      toast.error(error.response?.data?.message || 'Failed to cancel order')
    } finally {
      setCancelLoading(false)
    }
  }

  const handleReorder = async (order) => {
    try {
      const token = localStorage.getItem('token')
      
      // Add each item from the order to cart
      for (const item of order.items) {
        if (item.product) {
          await axios.post(
            `${API_URL}/cart`,
            {
              productId: item.product._id,
              quantity: item.quantity,
              isWholesale: item.isWholesale || false
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          )
        }
      }

      toast.success('Items added to cart successfully!')
      
      // Redirect to cart after a short delay
      setTimeout(() => {
        window.location.href = '/cart'
      }, 1000)
    } catch (error) {
      console.error('Error reordering:', error)
      toast.error(error.response?.data?.message || 'Failed to add items to cart')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
      case 'processing':
        return <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
      case 'shipped':
        return <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
      default:
        return <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = orders.filter(order => {
    if (selectedFilter === 'all') return true
    return order.status === selectedFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20 lg:pb-8">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">My Orders</h1>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 sm:space-x-8 px-3 sm:px-6 overflow-x-auto" aria-label="Tabs">
              {[
                { key: 'all', label: 'All Orders', count: orders.length },
                { key: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
                { key: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
                { key: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
                { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedFilter(tab.key)}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                    selectedFilter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
            <Package className="mx-auto h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 text-gray-400 mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              {selectedFilter === 'all' ? 'No orders yet' : `No ${selectedFilter} orders`}
            </h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              {selectedFilter === 'all' 
                ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                : `You don't have any ${selectedFilter} orders at the moment.`
              }
            </p>
            {selectedFilter === 'all' && (
              <a href="/products" className="btn-primary text-sm sm:text-base">
                Start Shopping
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                          <p className="text-xs sm:text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">
                          ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className={`flex items-center space-x-2 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-4 sm:px-6 py-3 sm:py-4">
                  <div className="space-y-3 sm:space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 sm:space-x-4">
                        <img
                          src={item.product?.image || 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=100'}
                          alt={item.product?.name || 'Product'}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product?.name || 'Product'}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Quantity: {item.quantity} × ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            {item.isWholesale && <span className="text-orange-600 ml-1">(Wholesale)</span>}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ₹{(item.quantity * item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="text-xs sm:text-sm text-gray-600">
                      <p>Shipping to: {order.shippingAddress?.fullName}</p>
                      <p>{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                    </div>
                    <div className="flex space-x-2 sm:space-x-3">
                      <button 
                        onClick={() => handleViewDetails(order)}
                        className="btn-secondary text-xs sm:text-sm px-3 py-2"
                      >
                        View Details
                      </button>
                      
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <button 
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancelLoading}
                          className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium px-3 py-2 disabled:opacity-50"
                        >
                          {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Order Details #{selectedOrder._id.slice(-8).toUpperCase()}
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order Status</p>
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      <span className="capitalize">{selectedOrder.status}</span>
                    </div>
                    {selectedOrder.cancelReason && (
                      <p className="text-sm text-red-600 mt-2">
                        Cancel Reason: {selectedOrder.cancelReason}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Order Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                    </p>
                    {selectedOrder.cancelledAt && (
                      <>
                        <p className="text-sm text-gray-600 mb-1 mt-2">Cancelled Date</p>
                        <p className="text-sm font-medium text-red-600">
                          {new Date(selectedOrder.cancelledAt).toLocaleString('en-IN')}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Shipping Address
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">
                      {selectedOrder.shippingAddress?.fullName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {selectedOrder.shippingAddress?.phone}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">
                    {selectedOrder.shippingAddress?.address}
                  </p>
                  <p className="text-sm text-gray-600 ml-6">
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.zipCode}
                  </p>
                  <p className="text-sm text-gray-600 ml-6">
                    {selectedOrder.shippingAddress?.country}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-blue-600" />
                  Order Items
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                      <img
                        src={item.product?.image || 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=150'}
                        alt={item.product?.name || 'Product'}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.product?.name || 'Product'}
                        </p>
                        {item.product?.size && (
                          <p className="text-sm text-gray-600 mt-1">
                            Size: {item.product.size}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2">
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-600">
                            Price: ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </p>
                          {item.isWholesale && (
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                              Wholesale
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{(item.quantity * item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                  Order Summary
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">
                      ₹{selectedOrder.subtotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                    </span>
                  </div>
                  {selectedOrder.shippingCost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">
                        ₹{selectedOrder.shippingCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  {selectedOrder.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">
                        ₹{selectedOrder.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-blue-600">
                        ₹{selectedOrder.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="text-gray-900 capitalize font-medium uppercase">
                      {selectedOrder.paymentMethod || 'UPI'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Status</span>
                    <span className={`font-medium ${
                      selectedOrder.paymentStatus === 'paid' 
                        ? 'text-green-600' 
                        : selectedOrder.paymentStatus === 'failed'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}>
                      {selectedOrder.paymentStatus === 'paid' ? 'Paid' : 
                       selectedOrder.paymentStatus === 'failed' ? 'Failed' : 'Pending'}
                    </span>
                  </div>
                  {selectedOrder.paymentId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment ID</span>
                      <span className="text-gray-900 font-mono text-xs">
                        {selectedOrder.paymentId}
                      </span>
                    </div>
                  )}
                  {selectedOrder.upiId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">UPI ID</span>
                      <span className="text-gray-900">
                        {selectedOrder.upiId}
                      </span>
                    </div>
                  )}
                  {selectedOrder.trackingNumber && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tracking Number</span>
                      <span className="text-gray-900 font-mono text-xs">
                        {selectedOrder.trackingNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}

              {/* Cancel Reason Input (for pending/processing orders) */}
              {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Cancel Order</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for cancellation (optional)
                    </label>
                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Please provide a reason for cancelling this order..."
                      maxLength={200}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {cancelReason.length}/200 characters
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                  <button
                    onClick={() => handleCancelOrder(selectedOrder._id)}
                    disabled={cancelLoading}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
                {selectedOrder.status === 'delivered' && (
                  <button
                    onClick={() => {
                      handleReorder(selectedOrder)
                      setShowDetailsModal(false)
                    }}
                    className="flex-1 btn-primary"
                  >
                    Reorder
                  </button>
                )}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders