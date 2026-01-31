import express from 'express'
import { body, validationResult } from 'express-validator'
import { adminAuth } from '../middleware/auth.js'
import {
  submitContactForm,
  getContactSubmissions
} from '../controllers/contactController.js'

const router = express.Router()

// Submit contact form
router.post('/submit', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('subject').trim().isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
  body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg
    })
  }
  
  await submitContactForm(req, res)
})

// Get contact submissions (Admin only)
router.get('/submissions', adminAuth, async (req, res) => {
  await getContactSubmissions(req, res)
})

export default router