import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Calendar, Edit2, Save, X } from 'lucide-react'
import { toast } from 'react-toastify'

const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      // API call to update profile would go here
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 pb-20 lg:pb-8">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">My Profile</h1>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-sip-500 to-blue-sip-600 px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 bg-white rounded-full flex items-center justify-center">
                <User className="h-8 w-8 sm:h-10 sm:w-10 text-blue-sip-600" />
              </div>
              <div className="text-white">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{user?.name}</h2>
                <p className="text-blue-sip-100 text-sm sm:text-base">{user?.email}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">
                    Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 text-blue-sip-600 hover:text-blue-sip-700 text-sm sm:text-base"
                >
                  <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 text-green-600 hover:text-green-700 text-sm sm:text-base"
                  >
                    <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 text-sm sm:text-base"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field text-sm sm:text-base"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-2 sm:p-3 rounded-lg text-sm sm:text-base">{user?.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field text-sm sm:text-base"
                      disabled
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-2 sm:p-3 rounded-lg flex items-center space-x-2 text-sm sm:text-base">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                      <span>{user?.email}</span>
                    </p>
                  )}
                </div>
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                )}
              </div>

              {/* <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field text-sm sm:text-base"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-2 sm:p-3 rounded-lg text-sm sm:text-base">
                    {user?.phone || 'Not provided'}
                  </p>
                )}
              </div> */}

              {/* <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="input-field resize-none text-sm sm:text-base"
                    placeholder="Enter your address"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-2 sm:p-3 rounded-lg text-sm sm:text-base">
                    {user?.address || 'Not provided'}
                  </p>
                )}
              </div> */}
            </div>
          </div>

          {/* Account Statistics */}
          {/* <div className="border-t border-gray-200 px-4 sm:px-6 py-4 sm:py-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Account Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-blue-sip-50 p-3 sm:p-4 rounded-lg">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-sip-600">12</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">₹486</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Spent</div>
              </div>
              <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">8</div>
                <div className="text-xs sm:text-sm text-gray-600">Products Owned</div>
              </div>
            </div>
          </div> */}

          {/* Security Section */}
         
        </div>
      </div>
    </div>
  )
}

export default Profile