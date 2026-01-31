import { sendContactFormEmail } from '../utils/email.js'

// Handle contact form submission
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      })
    }

    // Send email to admin
    try {
      await sendContactFormEmail({
        name,
        email,
        subject,
        message,
        submittedAt: new Date()
      })

      console.log('Contact form email sent successfully for:', email)

      res.json({
        success: true,
        message: 'Thank you for your message! We will get back to you soon.'
      })
    } catch (emailError) {
      console.error('Error sending contact form email:', emailError)
      
      // Still return success to user, but log the error
      res.json({
        success: true,
        message: 'Thank you for your message! We have received your inquiry.'
      })
    }
  } catch (error) {
    console.error('Contact form submission error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form. Please try again later.'
    })
  }
}

// Get contact form submissions (Admin only)
export const getContactSubmissions = async (req, res) => {
  try {
    // This would typically fetch from a database
    // For now, we'll return a placeholder response
    res.json({
      success: true,
      message: 'Contact submissions feature coming soon',
      submissions: []
    })
  } catch (error) {
    console.error('Error fetching contact submissions:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact submissions'
    })
  }
}