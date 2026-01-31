import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

const API_URL = 'https://api.bluesip.org.in/api'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`)
      if (response.data.success) {
        setUser(response.data.user)
      } else {
        console.error('Failed to fetch user:', response.data.message)
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email)
      const response = await axios.post(`${API_URL}/auth/login`, { email, password })
      
      if (response.data.success) {
        const { token, user } = response.data
        localStorage.setItem('token', token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(user)
        return { success: true }
      } else {
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      }
    }
  }

  const register = async (userData) => {
    try {
      console.log('Attempting registration for:', userData.email)
      const response = await axios.post(`${API_URL}/auth/register`, userData)
      
      if (response.data.success) {
        return { success: true, message: response.data.message }
      } else {
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      }
    }
  }

  const verifyOTP = async (email, otp) => {
    try {
      console.log('Attempting OTP verification for:', email)
      const response = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp })
      
      if (response.data.success) {
        return { success: true, message: response.data.message }
      } else {
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'OTP verification failed. Please try again.' 
      }
    }
  }

  const resendOTP = async (email) => {
    try {
      console.log('Attempting OTP resend for:', email)
      const response = await axios.post(`${API_URL}/auth/resend-otp`, { email })
      
      if (response.data.success) {
        return { success: true, message: response.data.message }
      } else {
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to resend OTP. Please try again.' 
      }
    }
  }

  const forgotPassword = async (email) => {
    try {
      console.log('Attempting forgot password for:', email)
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email })
      
      if (response.data.success) {
        return { success: true, message: response.data.message }
      } else {
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to send reset code. Please try again.' 
      }
    }
  }

  const resetPassword = async (email, otp, newPassword) => {
    try {
      console.log('Attempting password reset for:', email)
      const response = await axios.post(`${API_URL}/auth/reset-password`, { 
        email, 
        otp, 
        newPassword 
      })
      
      if (response.data.success) {
        return { success: true, message: response.data.message }
      } else {
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.error('Reset password error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to reset password. Please try again.' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}