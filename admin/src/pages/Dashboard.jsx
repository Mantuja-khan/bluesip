import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import axios from 'axios'

const API_URL = 'https://api.bluesip.org.in/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    recentOrders: []
  })
  const [loading, setLoading] = useState(true)

  // Mock data for charts
  const revenueData = [
    { name: 'Jan', revenue: 40000, orders: 24 },
    { name: 'Feb', revenue: 30000, orders: 18 },
    { name: 'Mar', revenue: 50000, orders: 32 },
    { name: 'Apr', revenue: 45000, orders: 28 },
    { name: 'May', revenue: 60000, orders: 38 },
    { name: 'Jun', revenue: 55000, orders: 35 },
  ]

  const productData = [
    { name: '500ml Bottle', sales: 120 },
    { name: '750ml Bottle', sales: 98 },
    { name: '1L Bottle', sales: 86 },
    { name: 'Gift Set', sales: 45 },
    { name: 'Accessories', sales: 32 },
  ]

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch orders stats
      const ordersResponse = await axios.get(`${API_URL}/orders/admin/all?limit=5`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      })
      
      // Fetch products count
      const productsResponse = await axios.get(`${API_URL}/products/admin/all?limit=1`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      })
      
      // Fetch users count
      const usersResponse = await axios.get(`${API_URL}/users?limit=1`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      })

      setStats({
        totalRevenue: ordersResponse.data.stats?.totalRevenue || 0,
        totalOrders: ordersResponse.data.stats?.totalOrders || 0,
        totalProducts: productsResponse.data.pagination?.totalProducts || 0,
        totalUsers: usersResponse.data.pagination?.totalUsers || 0,
        pendingOrders: ordersResponse.data.stats?.pendingOrders || 0,
        recentOrders: ordersResponse.data.orders || []
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString('en-IN'),
      change: '+8.2%',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString('en-IN'),
      change: '+2.1%',
      changeType: 'positive',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString('en-IN'),
      change: '+15.3%',
      changeType: 'positive',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-sip-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ml-1 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-600 ml-1">from last month</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <button className="text-blue-sip-600 hover:text-blue-sip-700 text-sm font-medium">
              View Details
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
            <button className="text-blue-sip-600 hover:text-blue-sip-700 text-sm font-medium">
              View All
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-blue-sip-600 hover:text-blue-sip-700 text-sm font-medium">
              View All Orders
            </button>
          </div>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-sip-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-blue-sip-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress?.fullName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <button className="w-full btn-primary text-left">
              Add New Product
            </button>
            <button className="w-full btn-secondary text-left">
              View Pending Orders
            </button>
            <button className="w-full btn-secondary text-left">
              Manage Users
            </button>
            <button className="w-full btn-secondary text-left">
              Generate Report
            </button>
          </div>

          {/* Alerts */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800">
                  Low Stock Alert
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  3 products are running low on stock
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard