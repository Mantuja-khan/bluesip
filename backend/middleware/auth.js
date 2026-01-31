// import jwt from 'jsonwebtoken'
// import User from '../models/User.js'

// export const auth = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '')
    
//     if (!token) {
//       return res.status(401).json({ message: 'Access denied. No token provided.' })
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
//     // Check if user still exists and is not blocked
//     const user = await User.findById(decoded.userId).select('-password -otp')
//     if (!user) {
//       return res.status(401).json({ message: 'Token is no longer valid.' })
//     }

//     if (user.isBlocked) {
//       return res.status(401).json({ message: 'Account has been blocked.' })
//     }

//     if (!user.isVerified) {
//       return res.status(401).json({ message: 'Please verify your email first.' })
//     }

//     req.user = {
//       userId: user._id.toString(),
//       email: user.email,
//       role: user.role,
//       name: user.name
//     }
    
//     next()
//   } catch (error) {
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({ message: 'Invalid token.' })
//     }
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ message: 'Token has expired.' })
//     }
//     console.error('Auth middleware error:', error)
//     res.status(500).json({ message: 'Server error during authentication.' })
//   }
// }

// export const adminAuth = async (req, res, next) => {
//   try {
//     // First run the regular auth middleware
//     await auth(req, res, () => {})
    
//     // Check if user is admin
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Admin access required.' })
//     }
    
//     next()
//   } catch (error) {
//     console.error('Admin auth middleware error:', error)
//     res.status(500).json({ message: 'Server error during admin authentication.' })
//   }
// }

import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const user = await User.findById(decoded.userId).select('-password -otp')
    
    if (!user) {
      return res.status(401).json({ message: 'Token is no longer valid.' })
    }

    if (user.isBlocked) {
      return res.status(401).json({ message: 'Account has been blocked.' })
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first.' })
    }

    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    }

    // Review compatibility
    req.user.id = req.user.userId

    next()

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' })
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired.' })
    }

    console.error('Auth middleware error:', error)
    res.status(500).json({ message: 'Server error during authentication.' })
  }
}

export const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {})
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required.' })
    }
    
    next()

  } catch (error) {
    console.error('Admin auth middleware error:', error)
    res.status(500).json({ message: 'Server error during admin authentication.' })
  }
}
export default auth;
