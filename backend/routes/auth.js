import express from 'express'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import {
  sendOTPEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendPasswordResetSuccessEmail
} from '../utils/email.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

// ================= REGISTER =================
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg })
    }

    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' })
    }

    const user = new User({ name, email, password })

    const otp = user.generateOTP()
    await user.save()

    await sendOTPEmail(email, otp, name)

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for OTP verification.'
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ success: false, message: 'Server error during registration' })
  }
})

// ================= VERIFY OTP =================
router.post('/verify-otp', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg })
    }

    const { email, otp } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'User is already verified' })
    }

    if (!user.verifyOTP(otp.toString())) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' })
    }

    user.isVerified = true
    user.otp = undefined
    await user.save()

    try {
      await sendWelcomeEmail(email, user.name)
      console.log('✅ Welcome email sent:', email)
    } catch (e) {
      console.error('❌ Welcome email error:', e)
    }

    res.json({
      success: true,
      message: 'Email verified successfully! You can now login.'
    })

  } catch (error) {
    console.error('OTP verification error:', error)
    res.status(500).json({ success: false, message: 'Server error during OTP verification' })
  }
})

// ================= RESEND OTP =================
router.post('/resend-otp', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg })
    }

    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'User is already verified' })
    }

    const otp = user.generateOTP()
    await user.save()

    await sendOTPEmail(email, otp, user.name)

    res.json({
      success: true,
      message: 'OTP sent successfully!'
    })

  } catch (error) {
    console.error('Resend OTP error:', error)
    res.status(500).json({ success: false, message: 'Server error while resending OTP' })
  }
})

// ================= FORGOT PASSWORD =================
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg })
    }

    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email address' })
    }

    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: 'Please verify your email first' })
    }

    const resetOTP = user.generatePasswordResetOTP()
    await user.save()

    await sendPasswordResetEmail(email, resetOTP, user.name)

    res.json({
      success: true,
      message: 'Password reset OTP sent to your email'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ success: false, message: 'Server error while processing password reset request' })
  }
})

// ================= RESET PASSWORD =================
router.post('/reset-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg })
    }

    const { email, otp, newPassword } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (!user.verifyPasswordResetOTP(otp.toString())) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' })
    }

    user.password = newPassword
    user.passwordResetOTP = undefined
    await user.save()

    try {
      await sendPasswordResetSuccessEmail(email, user.name)
      console.log('✅ Password reset success email sent:', email)
    } catch (e) {
      console.error('❌ Reset email error:', e)
    }

    res.json({
      success: true,
      message: 'Password reset successfully!'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ success: false, message: 'Server error while resetting password' })
  }
})

// ================= LOGIN =================
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg })
    }

    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: 'Please verify your email before logging in' })
    }

    if (user.isBlocked) {
      return res.status(401).json({ success: false, message: 'Your account has been blocked' })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    )

    user.password = undefined

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Server error during login' })
  }
})

// ================= PROFILE =================
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -otp -passwordResetOTP')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({ success: true, user })

  } catch (error) {
    console.error('Profile fetch error:', error)
    res.status(500).json({ success: false, message: 'Server error while fetching profile' })
  }
})

// ================= UPDATE PROFILE =================
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('phone').optional().trim().isMobilePhone(),
  body('address').optional().trim().isLength({ max: 200 })
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg })
    }

    const { name, phone, address } = req.body
    const updateData = {}

    if (name) updateData.name = name
    if (phone) updateData.phone = phone
    if (address) updateData.address = address

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -otp -passwordResetOTP')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    })

  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({ success: false, message: 'Server error while updating profile' })
  }
})

export default router
