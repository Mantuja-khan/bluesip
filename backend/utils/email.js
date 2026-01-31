import nodemailer from 'nodemailer'

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

// Send welcome email after successful registration
export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: {
        name: 'Blue Sip',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: '🎉 Welcome to Blue Sip - Your Hydration Journey Begins!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Blue Sip</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .welcome-box { background: white; border: 2px solid #3b82f6; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .feature-item { background: white; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #3b82f6; }
            .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💧 Welcome to Blue Sip!</h1>
              <p style="margin-top: 15px;">Your Premium Hydration Journey Starts Here</p>
            </div>
            <div class="content">
              <h2>Hello ${name}! 🌊</h2>
              <p>Welcome to the Blue Sip family! We're thrilled to have you join thousands of hydration enthusiasts who've discovered the perfect way to stay refreshed and healthy.</p>
              
              <div class="welcome-box">
                <h3 style="color: #3b82f6; margin-top: 0;">🎁 Welcome Gift Inside!</h3>
                <p style="margin-bottom: 0;">Get <strong>10% OFF</strong> your first order with code: <strong style="color: #3b82f6;">WELCOME10</strong></p>
              </div>

              <h3>Why You'll Love Blue Sip:</h3>
              <div class="features-grid">
                <div class="feature-item">
                  <h4 style="margin-top: 0; color: #3b82f6;">🧊 24-Hour Cold</h4>
                  <p style="margin-bottom: 0; font-size: 14px;">Advanced insulation keeps drinks ice-cold all day</p>
                </div>
                <div class="feature-item">
                  <h4 style="margin-top: 0; color: #3b82f6;">🔒 100% Leak-Proof</h4>
                  <p style="margin-bottom: 0; font-size: 14px;">Precision-engineered sealing technology</p>
                </div>
                <div class="feature-item">
                  <h4 style="margin-top: 0; color: #3b82f6;">🌱 Eco-Friendly</h4>
                  <p style="margin-bottom: 0; font-size: 14px;">BPA-free stainless steel construction</p>
                </div>
                <div class="feature-item">
                  <h4 style="margin-top: 0; color: #3b82f6;">🛡️ 2-Year Warranty</h4>
                  <p style="margin-bottom: 0; font-size: 14px;">Comprehensive protection guarantee</p>
                </div>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/products" class="cta-button">
                  🛍️ Shop Water Bottles Now
                </a>
              </div>

              <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #065f46; margin-top: 0;">🚀 What's Next?</h4>
                <ul style="color: #047857; margin-bottom: 0; padding-left: 20px;">
                  <li>Browse our premium water bottle collection</li>
                  <li>Use code WELCOME10 for 10% off your first order</li>
                  <li>Join our hydration community on social media</li>
                  <li>Track your orders and manage your account</li>
                </ul>
              </div>
              
              <p>If you have any questions about our water bottles or need hydration advice, our support team is here to help at <a href="mailto:support@bluesip.com">support@bluesip.com</a></p>
              
              <p>Stay hydrated, stay healthy! 💪<br><strong>The Blue Sip Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2024 Blue Sip. All rights reserved.</p>
              <p>📧 support@bluesip.com • 📞 +91 98765 43210</p>
              <p style="font-size: 12px; color: #9ca3af;">You're receiving this because you created an account with Blue Sip.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Welcome email sent successfully:', result.messageId)
    return result
  } catch (error) {
    console.error('❌ Error sending welcome email:', error)
    throw new Error('Failed to send welcome email')
  }
}

// Send password reset success email
export const sendPasswordResetSuccessEmail = async (email, name) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: {
        name: 'Blue Sip',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: '✅ Password Reset Successful - Blue Sip Account Secured',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Successful</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-box { background: white; border: 2px solid #10b981; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .security-tips { background: #fef3cd; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Successful!</h1>
              <p style="margin-top: 15px;">Your Blue Sip Account is Now Secure</p>
            </div>
            <div class="content">
              <h2>Hello ${name}! 👋</h2>
              <p>Great news! Your password has been successfully reset. Your Blue Sip account is now secured with your new password.</p>
              
              <div class="success-box">
                <h3 style="color: #10b981; margin-top: 0;">✅ Password Updated Successfully</h3>
                <p style="margin-bottom: 0;">You can now log in to your account using your new password and continue your hydration journey with Blue Sip.</p>
              </div>

              <div class="security-tips">
                <h4 style="color: #92400e; margin-top: 0;">🛡️ Security Tips for Your Account</h4>
                <ul style="color: #92400e; margin-bottom: 0; padding-left: 20px;">
                  <li>Use a strong, unique password that you don't use elsewhere</li>
                  <li>Never share your password with anyone</li>
                  <li>Log out from shared or public devices</li>
                  <li>Contact us immediately if you notice any suspicious activity</li>
                </ul>
              </div>

              <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #065f46; margin-top: 0;">🔍 Didn't Reset Your Password?</h4>
                <p style="color: #047857; margin-bottom: 0;">
                  If you didn't request this password reset, please contact our support team immediately at 
                  <a href="mailto:support@bluesip.com" style="color: #3b82f6;">support@bluesip.com</a> or call us at +91 98765 43210.
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/login" style="display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                  🚀 Login to Your Account
                </a>
              </div>
              
              <p>Thank you for keeping your Blue Sip account secure. If you have any questions or need assistance, our support team is always here to help.</p>
              
              <p>Stay hydrated, stay secure! 💧<br><strong>The Blue Sip Security Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2024 Blue Sip. All rights reserved.</p>
              <p>📧 support@bluesip.com • 📞 +91 98765 43210</p>
              <p style="font-size: 12px; color: #9ca3af;">This email was sent because your password was reset on your Blue Sip account.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Password reset success email sent successfully:', result.messageId)
    return result
  } catch (error) {
    console.error('❌ Error sending password reset success email:', error)
    throw new Error('Failed to send password reset success email')
  }
}

// Send OTP email
export const sendOTPEmail = async (email, otp, name) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: {
        name: 'Blue Sip',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Verify Your Blue Sip Account - OTP Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Account</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px solid #3b82f6; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 5px; margin: 10px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💧 Blue Sip</h1>
              <p>Welcome to Blue Sip - Premium Water Bottles</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Thank you for registering with Blue Sip. To complete your account verification, please use the OTP code below:</p>
              
              <div class="otp-box">
                <p>Your verification code is:</p>
                <div class="otp-code">${otp}</div>
                <p><strong>This code will expire in 10 minutes.</strong></p>
              </div>
              
              <p>If you didn't create an account with Blue Sip, please ignore this email.</p>
              
              <p>Best regards,<br>The Blue Sip Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Blue Sip. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('OTP email sent successfully:', result.messageId)
    return result
  } catch (error) {
    console.error('Error sending OTP email:', error)
    throw new Error('Failed to send OTP email')
  }
}

// Send password reset email
export const sendPasswordResetEmail = async (email, otp, name) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: {
        name: 'Blue Sip',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Reset Your Blue Sip Password - OTP Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px solid #3b82f6; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 5px; margin: 10px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            .warning { background: #fef3cd; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💧 Blue Sip</h1>
              <p>Password Reset Request</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>We received a request to reset your password for your Blue Sip account. Use the OTP code below to reset your password:</p>
              
              <div class="otp-box">
                <p>Your password reset code is:</p>
                <div class="otp-code">${otp}</div>
                <p><strong>This code will expire in 10 minutes.</strong></p>
              </div>
              
              <div class="warning">
                <p><strong>Security Notice:</strong> If you didn't request a password reset, please ignore this email. Your account remains secure.</p>
              </div>
              
              <p>Best regards,<br>The Blue Sip Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Blue Sip. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Password reset email sent successfully:', result.messageId)
    return result
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw new Error('Failed to send password reset email')
  }
}
// Send order confirmation email
export const sendOrderConfirmationEmail = async (email, orderData) => {
  try {

    const transporter = createTransporter()

    const itemsHtml = orderData.items.map(item => `
      <tr>
        <td style="padding:10px">
          <strong>${item.product?.name}</strong><br/>
          Qty: ${item.quantity}
        </td>
        <td align="right">
          ₹${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join("")

    const mailOptions = {
      from: {
        name: "Blue Sip",
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: `Order Confirmed - ${orderData.orderNumber}`,
      html: `
      <h2>Thank You ${orderData.customerName}</h2>

      <p>Your order has been successfully placed.</p>

      // <h3>Order Number: <span style="color:green">${orderData.orderNumber}</span></h3>

      <h3>Order Items</h3>
      <table width="100%" border="1" cellspacing="0" cellpadding="10">
        ${itemsHtml}
      </table>

      <h3>Total Amount: ₹${orderData.total}</h3>

      <h3>Shipping Address</h3>
      <p>
      ${orderData.shippingAddress.fullName}<br/>
      ${orderData.shippingAddress.address}<br/>
      ${orderData.shippingAddress.city} - ${orderData.shippingAddress.zipCode}<br/>
      Phone: ${orderData.shippingAddress.phone}
      </p>

      <p>We will deliver your order in 3-5 working days 🚚</p>

      <strong>Blue Sip Team</strong>
      `
    }

    const result = await transporter.sendMail(mailOptions)

    console.log("Customer Email Sent:", result.messageId)

  } catch (error) {
    console.error("Customer Email Error:", error)
    throw error
  }
}

// ---------------- ADMIN EMAIL ------------------

export const sendAdminOrderNotification = async (orderData) => {
  try {

    const transporter = createTransporter()

    const adminMailOptions = {
      from: "Blue Sip <process.env.EMAIL_USER>",
      to: process.env.ADMIN_EMAIL,
      subject: `New Order Received - ${orderData.orderNumber}`,
      html: `
      <h2>New Order Received</h2>

      // <h3>Order Number: ${orderData.orderNumber}</h3>

      <h4>Customer Details</h4>
      <p>
      Name: ${orderData.customerName}<br/>
      Email: ${orderData.customerEmail}<br/>
      Phone: ${orderData.shippingAddress.phone}
      </p>

      <h4>Total Amount: ₹${orderData.total}</h4>

      <p>Please process this order from admin dashboard.</p>
      `
    }

    const result = await transporter.sendMail(adminMailOptions)

    console.log("Admin Email Sent:", result.messageId)

  } catch (error) {
    console.error("Admin Email Error:", error)
    throw error
  }
}

// Send contact form email to admin
export const sendContactFormEmail = async (contactData) => {
  try {
    const transporter = createTransporter()

    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER

    const mailOptions = {
      from: {
        name: 'Blue Sip Contact Form',
        address: process.env.EMAIL_USER
      },
      to: adminEmail,
      replyTo: contactData.email,
      subject: `🔔 New Contact Form: ${contactData.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 20px 0; }
            .message-box { background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            .label { font-weight: bold; color: #374151; }
            .value { color: #6b7280; margin-bottom: 10px; }
            .priority-high { border-left: 4px solid #ef4444; }
            .priority-normal { border-left: 4px solid #3b82f6; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💧 Blue Sip Admin</h1>
              <p>New Customer Contact Form Submission</p>
            </div>
            <div class="content">
              <h2>📬 You have received a new message!</h2>
              <p>A customer has submitted a contact form on the Blue Sip website. Please review the details below and respond promptly.</p>
              
              <div class="info-box priority-normal">
                <h3>📋 Contact Information</h3>
                <div class="value">
                  <span class="label">Customer Name:</span> ${contactData.name}
                </div>
                <div class="value">
                  <span class="label">Email Address:</span> ${contactData.email}
                </div>
                <div class="value">
                  <span class="label">Subject:</span> ${contactData.subject}
                </div>
                <div class="value">
                  <span class="label">Submitted On:</span> ${new Date(contactData.submittedAt).toLocaleString('en-IN', { 
                    timeZone: 'Asia/Kolkata',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })} IST
                </div>
              </div>
              
              <div class="message-box">
                <h3>💬 Customer Message</h3>
                <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                  <p style="white-space: pre-wrap; margin: 0; font-size: 16px; line-height: 1.6;">${contactData.message}</p>
                </div>
              </div>

              <div style="background: #fef3cd; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #92400e;">⚡ Action Required</h4>
                <p style="margin-bottom: 0; color: #92400e;">
                  Please respond to this customer inquiry within 24 hours to maintain our excellent customer service standards.
                </p>
              </div>

              <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #065f46;">💡 Quick Response Tips</h4>
                <ul style="margin-bottom: 0; color: #065f46; padding-left: 20px;">
                  <li>Address the customer by name for a personal touch</li>
                  <li>Reference their specific question or concern</li>
                  <li>Provide helpful information about our water bottles</li>
                  <li>Include relevant product links if applicable</li>
                  <li>End with an invitation for further questions</li>
                </ul>
              </div>
              
              <p><strong>📧 Reply Instructions:</strong> You can reply directly to this email to respond to ${contactData.name}. The customer's email (${contactData.email}) is set as the reply-to address.</p>
            </div>
            <div class="footer">
              <p>© 2024 Blue Sip Admin Panel. All rights reserved.</p>
              <p>This email was automatically generated from the Blue Sip contact form.</p>
              <p style="font-size: 12px; color: #9ca3af;">Admin Dashboard: <a href="http://localhost:3001" style="color: #3b82f6;">http://localhost:3001</a></p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Contact form email sent to admin successfully:', result.messageId)
    return result
  } catch (error) {
    console.error('❌ Error sending contact form email to admin:', error)
    throw new Error('Failed to send contact form email to admin')
  }
}