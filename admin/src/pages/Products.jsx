import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  AlertTriangle,
  ShoppingCart,
  Upload,
  X
} from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'
const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  })

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    size: '',
    stock: '',
    category: 'water-bottle',
    image: '',
    discount: 0,
    isWholesale: false,
    wholesalePrice: '',
    wholesaleDiscount: 0,
    minWholesaleQuantity: 10,
    wholesaleDescription: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [searchTerm, categoryFilter, statusFilter, pagination.currentPage])

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter && { category: categoryFilter }),
        ...(statusFilter && { status: statusFilter })
      })

      const response = await axios.get(`${API_URL}/products/admin/all?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      })

      setProducts(response.data.products)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      let imageUrl = productForm.image

      // If there's a new image file, convert to base64 for storage
      if (imageFile) {
        imageUrl = imagePreview
      }

      const productData = {
        ...productForm,
        image: imageUrl,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        discount: parseFloat(productForm.discount) || 0,
        ...(productForm.isWholesale && {
          wholesalePrice: parseFloat(productForm.wholesalePrice),
          wholesaleDiscount: parseFloat(productForm.wholesaleDiscount) || 0,
          minWholesaleQuantity: parseInt(productForm.minWholesaleQuantity)
        })
      }

      if (editingProduct) {
        await axios.put(`${API_URL}/products/${editingProduct._id}`, productData, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        })
        toast.success('Product updated successfully')
      } else {
        await axios.post(`${API_URL}/products`, productData, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        })
        toast.success('Product created successfully')
      }

      setShowAddModal(false)
      setEditingProduct(null)
      resetForm()
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error(error.response?.data?.message || 'Failed to save product')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      size: product.size,
      stock: product.stock.toString(),
      category: product.category,
      image: product.image || '',
      discount: product.discount || 0,
      isWholesale: product.isWholesale || false,
      wholesalePrice: product.wholesalePrice?.toString() || '',
      wholesaleDiscount: product.wholesaleDiscount || 0,
      minWholesaleQuantity: product.minWholesaleQuantity || 10,
      wholesaleDescription: product.wholesaleDescription || ''
    })
    setImagePreview(product.image || '')
    setShowAddModal(true)
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to permanently delete this product? This action cannot be undone.')) {
      return
    }

    try {
      await axios.delete(`${API_URL}/products/${productId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      })
      toast.success('Product deleted successfully')
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      size: '',
      stock: '',
      category: 'water-bottle',
      image: '',
      discount: 0,
      isWholesale: false,
      wholesalePrice: '',
      wholesaleDiscount: 0,
      minWholesaleQuantity: 10,
      wholesaleDescription: ''
    })
    setEditingProduct(null)
    setShowAddModal(false)
    setImageFile(null)
    setImagePreview('')
  }

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
            <option value="water-bottle">Water Bottles</option>
            <option value="accessories">Accessories</option>
            <option value="gift-sets">Gift Sets</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.image || 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.size}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {product.category.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ₹{product.price.toLocaleString('en-IN')}
                      {product.discount > 0 && (
                        <span className="ml-2 text-xs text-green-600">
                          -{product.discount}%
                        </span>
                      )}
                      {product.isWholesale && (
                        <div className="text-xs text-orange-600">
                          Wholesale: ₹{product.wholesalePrice?.toLocaleString('en-IN')}
                          {product.wholesaleDiscount > 0 && (
                            <span className="ml-1 text-green-600">
                              -{product.wholesaleDiscount}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm ${
                        product.stock < 10 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {product.stock}
                      </span>
                      {product.stock < 10 && (
                        <AlertTriangle className="h-4 w-4 text-red-500 ml-1" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        Retail
                      </span>
                      {product.isWholesale && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                          Wholesale
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      product.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalProducts)} of {pagination.totalProducts} products
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={pagination.currentPage === 1}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={productForm.name}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={productForm.category}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="water-bottle">Water Bottle</option>
                    <option value="accessories">Accessories</option>
                    <option value="gift-sets">Gift Sets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={productForm.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size *
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={productForm.size}
                    onChange={handleInputChange}
                    placeholder="e.g., 500ml, 750ml, 1L"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={productForm.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retail Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={productForm.discount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </label>
                  </div>
                  <div className="text-sm text-gray-500">or</div>
                  <div className="flex-1">
                    <input
                      type="url"
                      name="image"
                      value={productForm.image}
                      onChange={handleInputChange}
                      placeholder="Enter image URL"
                      className="input-field"
                    />
                  </div>
                </div>
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="input-field resize-none"
                  required
                />
              </div>

              {/* Wholesale Options */}
              <div className="border-t pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    name="isWholesale"
                    checked={productForm.isWholesale}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-sip-600 focus:ring-blue-sip-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Enable Wholesale Options
                  </label>
                </div>

                {productForm.isWholesale && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-orange-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wholesale Price (₹) *
                      </label>
                      <input
                        type="number"
                        name="wholesalePrice"
                        value={productForm.wholesalePrice}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="input-field"
                        required={productForm.isWholesale}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wholesale Discount (%)
                      </label>
                      <input
                        type="number"
                        name="wholesaleDiscount"
                        value={productForm.wholesaleDiscount}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Wholesale Quantity *
                      </label>
                      <input
                        type="number"
                        name="minWholesaleQuantity"
                        value={productForm.minWholesaleQuantity}
                        onChange={handleInputChange}
                        min="1"
                        className="input-field"
                        required={productForm.isWholesale}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wholesale Description
                      </label>
                      <textarea
                        name="wholesaleDescription"
                        value={productForm.wholesaleDescription}
                        onChange={handleInputChange}
                        rows="3"
                        className="input-field resize-none"
                        placeholder="Special terms or conditions for wholesale buyers..."
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products