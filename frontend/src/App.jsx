import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy"
import VerifyOTP from './pages/VerifyOTP'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import AboutUs from './pages/AboutUs'
// import Destributors from './pages/Destributors' // Commented out per request
import CustomBottle from './pages/CustomBottle' // New Customization Page
import ContactUs from './pages/ContactUs'
import ProtectedRoute from './components/ProtectedRoute'
import StickerEditorModal from './components/StickerEditorModal'
// import StickerButton from './components/StickerButton'

function App() {
  const [openStickerEditor, setOpenStickerEditor] = useState(false)

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <main className="min-h-screen">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                
                {/* Replaced Distributors with Custom Bottle Page */}
                {/* <Route path="/destributors" element={<Destributors />} /> */}
                <Route path="/customize" element={<CustomBottle />} /> 
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/terms-condition" element={<TermsConditions />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                {/* Protected Routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />

            {openStickerEditor && (
              <StickerEditorModal onClose={() => setOpenStickerEditor(false)} />
            )}

            <ToastContainer
              position="top-right"
              autoClose={3000}
              theme="light"
            />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App