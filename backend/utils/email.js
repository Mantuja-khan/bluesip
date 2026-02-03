// import nodemailer from 'nodemailer'

// // Create transporter
// const createTransport = () => {
//   return nodemailer.createTransport({
//     host: process.env.EMAIL_HOST || 'smtp.gmail.com',
//     port: process.env.EMAIL_PORT || 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     }
//   })
// }

// // Send welcome email after successful registration
// export const sendWelcomeEmail = async (email, name) => {
//   try {
//     const transporter = createTransport()

//     const mailOptions = {
//       from: {
//         name: 'Blue Sip',
//         address: process.env.EMAIL_USER
//       },
//       to: email,
//       subject: '🎉 Welcome to Blue Sip - Your Hydration Journey Begins!',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="utf-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Welcome to Blue Sip</title>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//             .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
//             .welcome-box { background: white; border: 2px solid #3b82f6; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
//             .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
//             .feature-item { background: white; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #3b82f6; }
//             .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
//             .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>💧 Welcome to Blue Sip!</h1>
//               <p style="margin-top: 15px;">Your Premium Hydration Journey Starts Here</p>
//             </div>
//             <div class="content">
//               <h2>Hello ${name}! 🌊</h2>
//               <p>Welcome to the Blue Sip family! We're thrilled to have you join thousands of hydration enthusiasts who've discovered the perfect way to stay refreshed and healthy.</p>
              
//               <div class="welcome-box">
//                 <h3 style="color: #3b82f6; margin-top: 0;">🎁 Welcome Gift Inside!</h3>
//                 <p style="margin-bottom: 0;">Get <strong>10% OFF</strong> your first order with code: <strong style="color: #3b82f6;">WELCOME10</strong></p>
//               </div>

//               <h3>Why You'll Love Blue Sip:</h3>
//               <div class="features-grid">
//                 <div class="feature-item">
//                   <h4 style="margin-top: 0; color: #3b82f6;">🧊 24-Hour Cold</h4>
//                   <p style="margin-bottom: 0; font-size: 14px;">Advanced insulation keeps drinks ice-cold all day</p>
//                 </div>
//                 <div class="feature-item">
//                   <h4 style="margin-top: 0; color: #3b82f6;">🔒 100% Leak-Proof</h4>
//                   <p style="margin-bottom: 0; font-size: 14px;">Precision-engineered sealing technology</p>
//                 </div>
//                 <div class="feature-item">
//                   <h4 style="margin-top: 0; color: #3b82f6;">🌱 Eco-Friendly</h4>
//                   <p style="margin-bottom: 0; font-size: 14px;">BPA-free stainless steel construction</p>
//                 </div>
//                 <div class="feature-item">
//                   <h4 style="margin-top: 0; color: #3b82f6;">🛡️ 2-Year Warranty</h4>
//                   <p style="margin-bottom: 0; font-size: 14px;">Comprehensive protection guarantee</p>
//                 </div>
//               </div>

//               <div style="text-align: center; margin: 30px 0;">
//                 <a href="http://localhost:3000/products" class="cta-button">
//                   🛍️ Shop Water Bottles Now
//                 </a>
//               </div>

//               <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
//                 <h4 style="color: #065f46; margin-top: 0;">🚀 What's Next?</h4>
//                 <ul style="color: #047857; margin-bottom: 0; padding-left: 20px;">
//                   <li>Browse our premium water bottle collection</li>
//                   <li>Use code WELCOME10 for 10% off your first order</li>
//                   <li>Join our hydration community on social media</li>
//                   <li>Track your orders and manage your account</li>
//                 </ul>
//               </div>
              
//               <p>If you have any questions about our water bottles or need hydration advice, our support team is here to help at <a href="mailto:support@bluesip.com">support@bluesip.com</a></p>
              
//               <p>Stay hydrated, stay healthy! 💪<br><strong>The Blue Sip Team</strong></p>
//             </div>
//             <div class="footer">
//               <p>© 2024 Blue Sip. All rights reserved.</p>
//               <p>📧 support@bluesip.com • 📞 91 89306-87697</p>
//               <p style="font-size: 12px; color: #9ca3af;">You're receiving this because you created an account with Blue Sip.</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     }

//     const result = await transporter.sendMail(mailOptions)
//     console.log('✅ Welcome email sent successfully:', result.messageId)
//     return result
//   } catch (error) {
//     console.error('❌ Error sending welcome email:', error)
//     throw new Error('Failed to send welcome email')
//   }
// }

// // Send password reset success email
// export const sendPasswordResetSuccessEmail = async (email, name) => {
//   try {
//     const transporter = createTransport()

//     const mailOptions = {
//       from: {
//         name: 'Blue Sip',
//         address: process.env.EMAIL_USER
//       },
//       to: email,
//       subject: '✅ Password Reset Successful - Blue Sip Account Secured',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="utf-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Password Reset Successful</title>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//             .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
//             .success-box { background: white; border: 2px solid #10b981; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
//             .security-tips { background: #fef3cd; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 20px 0; }
//             .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>🔐 Password Reset Successful!</h1>
//               <p style="margin-top: 15px;">Your Blue Sip Account is Now Secure</p>
//             </div>
//             <div class="content">
//               <h2>Hello ${name}! 👋</h2>
//               <p>Great news! Your password has been successfully reset. Your Blue Sip account is now secured with your new password.</p>
              
//               <div class="success-box">
//                 <h3 style="color: #10b981; margin-top: 0;">✅ Password Updated Successfully</h3>
//                 <p style="margin-bottom: 0;">You can now log in to your account using your new password and continue your hydration journey with Blue Sip.</p>
//               </div>

//               <div class="security-tips">
//                 <h4 style="color: #92400e; margin-top: 0;">🛡️ Security Tips for Your Account</h4>
//                 <ul style="color: #92400e; margin-bottom: 0; padding-left: 20px;">
//                   <li>Use a strong, unique password that you don't use elsewhere</li>
//                   <li>Never share your password with anyone</li>
//                   <li>Log out from shared or public devices</li>
//                   <li>Contact us immediately if you notice any suspicious activity</li>
//                 </ul>
//               </div>

//               <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
//                 <h4 style="color: #065f46; margin-top: 0;">🔍 Didn't Reset Your Password?</h4>
//                 <p style="color: #047857; margin-bottom: 0;">
//                   If you didn't request this password reset, please contact our support team immediately at 
//                   <a href="mailto:support@bluesip.com" style="color: #3b82f6;">support@bluesip.com</a> or call us at 91 89306-87697.
//                 </p>
//               </div>

//               <div style="text-align: center; margin: 30px 0;">
//                 <a href="http://localhost:3000/login" style="display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
//                   🚀 Login to Your Account
//                 </a>
//               </div>
              
//               <p>Thank you for keeping your Blue Sip account secure. If you have any questions or need assistance, our support team is always here to help.</p>
              
//               <p>Stay hydrated, stay secure! 💧<br><strong>The Blue Sip Security Team</strong></p>
//             </div>
//             <div class="footer">
//               <p>© 2024 Blue Sip. All rights reserved.</p>
//               <p>📧 support@bluesip.com • 📞 91 89306-87697</p>
//               <p style="font-size: 12px; color: #9ca3af;">This email was sent because your password was reset on your Blue Sip account.</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     }

//     const result = await transporter.sendMail(mailOptions)
//     console.log('✅ Password reset success email sent successfully:', result.messageId)
//     return result
//   } catch (error) {
//     console.error('❌ Error sending password reset success email:', error)
//     throw new Error('Failed to send password reset success email')
//   }
// }

// // Send OTP email
// export const sendOTPEmail = async (email, otp, name) => {
//   try {
//     const transporter = createTransport()

//     const mailOptions = {
//       from: {
//         name: 'Blue Sip',
//         address: process.env.EMAIL_USER
//       },
//       to: email,
//       subject: 'Verify Your Blue Sip Account - OTP Code',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="utf-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Verify Your Account</title>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//             .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
//             .otp-box { background: white; border: 2px solid #3b82f6; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
//             .otp-code { font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 5px; margin: 10px 0; }
//             .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
//             .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>💧 Blue Sip</h1>
//               <p>Welcome to Blue Sip - Premium Water Bottles</p>
//             </div>
//             <div class="content">
//               <h2>Hello ${name}!</h2>
//               <p>Thank you for registering with Blue Sip. To complete your account verification, please use the OTP code below:</p>
              
//               <div class="otp-box">
//                 <p>Your verification code is:</p>
//                 <div class="otp-code">${otp}</div>
//                 <p><strong>This code will expire in 10 minutes.</strong></p>
//               </div>
              
//               <p>If you didn't create an account with Blue Sip, please ignore this email.</p>
              
//               <p>Best regards,<br>The Blue Sip Team</p>
//             </div>
//             <div class="footer">
//               <p>© 2024 Blue Sip. All rights reserved.</p>
//               <p>This is an automated email. Please do not reply to this message.</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     }

//     const result = await transporter.sendMail(mailOptions)
//     console.log('OTP email sent successfully:', result.messageId)
//     return result
//   } catch (error) {
//     console.error('Error sending OTP email:', error)
//     throw new Error('Failed to send OTP email')
//   }
// }

// // Send password reset email
// export const sendPasswordResetEmail = async (email, otp, name) => {
//   try {
//     const transporter = createTransport()

//     const mailOptions = {
//       from: {
//         name: 'Blue Sip',
//         address: process.env.EMAIL_USER
//       },
//       to: email,
//       subject: 'Reset Your Blue Sip Password - OTP Code',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="utf-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Reset Your Password</title>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//             .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
//             .otp-box { background: white; border: 2px solid #3b82f6; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
//             .otp-code { font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 5px; margin: 10px 0; }
//             .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
//             .warning { background: #fef3cd; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 20px 0; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>💧 Blue Sip</h1>
//               <p>Password Reset Request</p>
//             </div>
//             <div class="content">
//               <h2>Hello ${name}!</h2>
//               <p>We received a request to reset your password for your Blue Sip account. Use the OTP code below to reset your password:</p>
              
//               <div class="otp-box">
//                 <p>Your password reset code is:</p>
//                 <div class="otp-code">${otp}</div>
//                 <p><strong>This code will expire in 10 minutes.</strong></p>
//               </div>
              
//               <div class="warning">
//                 <p><strong>Security Notice:</strong> If you didn't request a password reset, please ignore this email. Your account remains secure.</p>
//               </div>
              
//               <p>Best regards,<br>The Blue Sip Team</p>
//             </div>
//             <div class="footer">
//               <p>© 2024 Blue Sip. All rights reserved.</p>
//               <p>This is an automated email. Please do not reply to this message.</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     }

//     const result = await transporter.sendMail(mailOptions)
//     console.log('Password reset email sent successfully:', result.messageId)
//     return result
//   } catch (error) {
//     console.error('Error sending password reset email:', error)
//     throw new Error('Failed to send password reset email')
//   }
// }
// // Send order confirmation email
// export const sendOrderConfirmationEmail = async (email, orderData) => {
//   try {

//     const transporter = createTransport()

//     const itemsHtml = orderData.items.map(item => `
//       <tr>
//         <td style="padding:10px">
//           <strong>${item.product?.name}</strong><br/>
//           Qty: ${item.quantity}
//         </td>
//         <td align="right">
//           ₹${(item.price * item.quantity).toFixed(2)}
//         </td>
//       </tr>
//     `).join("")

//     const mailOptions = {
//       from: {
//         name: "Blue Sip",
//         address: process.env.EMAIL_USER
//       },
//       to: email,
//       subject: `Order Confirmed - ${orderData.orderNumber}`,
//       html: `
//       <h2>Thank You ${orderData.customerName}</h2>

//       <p>Your order has been successfully placed.</p>

//       // <h3>Order Number: <span style="color:green">${orderData.orderNumber}</span></h3>

//       <h3>Order Items</h3>
//       <table width="100%" border="1" cellspacing="0" cellpadding="10">
//         ${itemsHtml}
//       </table>

//       <h3>Total Amount: ₹${orderData.total}</h3>

//       <h3>Shipping Address</h3>
//       <p>
//       ${orderData.shippingAddress.fullName}<br/>
//       ${orderData.shippingAddress.address}<br/>
//       ${orderData.shippingAddress.city} - ${orderData.shippingAddress.zipCode}<br/>
//       Phone: ${orderData.shippingAddress.phone}
//       </p>

//       <p>We will deliver your order in 3-5 working days 🚚</p>

//       <strong>Blue Sip Team</strong>
//       `
//     }

//     const result = await transporter.sendMail(mailOptions)

//     console.log("Customer Email Sent:", result.messageId)

//   } catch (error) {
//     console.error("Customer Email Error:", error)
//     throw error
//   }
// }

// // ---------------- ADMIN EMAIL ------------------

// export const sendAdminOrderNotification = async (orderData) => {
//   try {

//     const transporter = createTransport();

//     if (!process.env.ADMIN_EMAIL) {
//       throw new Error("ADMIN_EMAIL not defined in env file");
//     }

//     const mailOptions = {
//       from: {
//         name: "Blue Sip Orders",
//         address: process.env.EMAIL_USER
//       },
//       to: process.env.ADMIN_EMAIL,
//       subject: `🛒 New Order Received | Order #${orderData.orderNumber}`,

//       html: `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <title>New Order Alert</title>
//       </head>

//       <body style="font-family: Arial, sans-serif; background:#f8fafc; padding:20px;">

//       <div style="max-width:600px;margin:auto;background:#ffffff;padding:20px;border-radius:10px;border:1px solid #e5e7eb">

//         <h2 style="color:#2563eb;">📦 New Order Received - Blue Sip</h2>

//         <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>

//         <hr/>

//         <h3>👤 Customer Details</h3>

//         <p>
//           <strong>Name:</strong> ${orderData.customerName}<br/>
//           <strong>Email:</strong> ${orderData.customerEmail}<br/>
//           <strong>Phone:</strong> ${orderData.shippingAddress.phone}
//         </p>

//         <hr/>

//         <h3>💰 Payment Info</h3>

//         <p>
//           <strong>Total Amount:</strong> ₹${orderData.total}<br/>
//           <strong>Payment Method:</strong> Razorpay
//         </p>

//         <hr/>

//         <h3>📍 Delivery Address</h3>

//         <p>
//           ${orderData.shippingAddress.fullName}<br/>
//           ${orderData.shippingAddress.address}<br/>
//           ${orderData.shippingAddress.city} - ${orderData.shippingAddress.zipCode}
//         </p>

//         <hr/>

//         <p style="color:#16a34a;font-weight:bold;">
//           Please login to Admin Panel to process this order 🚀
//         </p>

//         <p style="font-size:12px;color:#6b7280;">
//           Blue Sip Automated Order System
//         </p>

//       </div>

//       </body>
//       </html>
//       `
//     };
//     const result = await transporter.sendMail(mailOptions);

//     console.log("✅ Admin Order Email Sent Successfully:", result.messageId);

//     return result;

//   } catch (error) {

//     console.error("❌ Admin Email Sending Failed:", error.message);

//     throw error;
//   }
// };
// // Send contact form email to admin
// export const sendContactFormEmail = async (contactData) => {
//   try {
//     const transporter = createTransport()

//     const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER

//     const mailOptions = {
//       from: {
//         name: 'Blue Sip Contact Form',
//         address: process.env.EMAIL_USER
//       },
//       to: adminEmail,
//       replyTo: contactData.email,
//       subject: `🔔 New Contact Form: ${contactData.subject}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="utf-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>New Contact Form Submission</title>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//             .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
//             .info-box { background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 20px 0; }
//             .message-box { background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 20px 0; }
//             .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
//             .label { font-weight: bold; color: #374151; }
//             .value { color: #6b7280; margin-bottom: 10px; }
//             .priority-high { border-left: 4px solid #ef4444; }
//             .priority-normal { border-left: 4px solid #3b82f6; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>💧 Blue Sip Admin</h1>
//               <p>New Customer Contact Form Submission</p>
//             </div>
//             <div class="content">
//               <h2>📬 You have received a new message!</h2>
//               <p>A customer has submitted a contact form on the Blue Sip website. Please review the details below and respond promptly.</p>
              
//               <div class="info-box priority-normal">
//                 <h3>📋 Contact Information</h3>
//                 <div class="value">
//                   <span class="label">Customer Name:</span> ${contactData.name}
//                 </div>
//                 <div class="value">
//                   <span class="label">Email Address:</span> ${contactData.email}
//                 </div>
//                 <div class="value">
//                   <span class="label">Subject:</span> ${contactData.subject}
//                 </div>
//                 <div class="value">
//                   <span class="label">Submitted On:</span> ${new Date(contactData.submittedAt).toLocaleString('en-IN', { 
//                     timeZone: 'Asia/Kolkata',
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric',
//                     hour: '2-digit',
//                     minute: '2-digit'
//                   })} IST
//                 </div>
//               </div>
              
//               <div class="message-box">
//                 <h3>💬 Customer Message</h3>
//                 <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
//                   <p style="white-space: pre-wrap; margin: 0; font-size: 16px; line-height: 1.6;">${contactData.message}</p>
//                 </div>
//               </div>

//               <div style="background: #fef3cd; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 20px 0;">
//                 <h4 style="margin-top: 0; color: #92400e;">⚡ Action Required</h4>
//                 <p style="margin-bottom: 0; color: #92400e;">
//                   Please respond to this customer inquiry within 24 hours to maintain our excellent customer service standards.
//                 </p>
//               </div>

//               <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin: 20px 0;">
//                 <h4 style="margin-top: 0; color: #065f46;">💡 Quick Response Tips</h4>
//                 <ul style="margin-bottom: 0; color: #065f46; padding-left: 20px;">
//                   <li>Address the customer by name for a personal touch</li>
//                   <li>Reference their specific question or concern</li>
//                   <li>Provide helpful information about our water bottles</li>
//                   <li>Include relevant product links if applicable</li>
//                   <li>End with an invitation for further questions</li>
//                 </ul>
//               </div>
              
//               <p><strong>📧 Reply Instructions:</strong> You can reply directly to this email to respond to ${contactData.name}. The customer's email (${contactData.email}) is set as the reply-to address.</p>
//             </div>
//             <div class="footer">
//               <p>© 2024 Blue Sip Admin Panel. All rights reserved.</p>
//               <p>This email was automatically generated from the Blue Sip contact form.</p>
//               <p style="font-size: 12px; color: #9ca3af;">Admin Dashboard: <a href="http://localhost:3001" style="color: #3b82f6;">http://localhost:3001</a></p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     }

//     const result = await transporter.sendMail(mailOptions)
//     console.log('✅ Contact form email sent to admin successfully:', result.messageId)
//     return result
//   } catch (error) {
//     console.error('❌ Error sending contact form email to admin:', error)
//     throw new Error('Failed to send contact form email to admin')
//   }
// }



// import nodemailer from 'nodemailer'
// // Create transporter
// const createTransport = () => {
//   return nodemailer.createTransport({
//     host: process.env.EMAIL_HOST || 'smtp.gmail.com',
//     port: process.env.EMAIL_PORT || 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     }
//   })
// }

// // Send welcome email after successful registration
// export const sendWelcomeEmail = async (email, name) => {
//   try {
//     const transporter = createTransport()

//     const mailOptions = {
//       from: {
//         name: 'Blue Sip',
//         address: process.env.EMAIL_USER
//       },
//       to: email,
//       subject: 'Welcome to Blue Sip - Your Hydration Journey Begins',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Welcome to Blue Sip</title>
//           <style>
//             body { font-family: Arial, sans-serif; background:#ffffff; padding:20px; margin:0; line-height:1.6; color:#000000; }
//             .container { max-width:600px; margin:auto; background:#ffffff; border:1px solid #000000; }
//             .header { background:#000000; color:#ffffff; padding:30px; text-align:center; }
//             .content { padding:30px; background:#ffffff; }
//             .welcome-box { background:#ffffff; border:2px solid #000000; padding:25px; text-align:center; margin:25px 0; }
//             .features-grid { display:grid; grid-template-columns:1fr 1fr; gap:15px; margin:25px 0; }
//             .feature-item { background:#ffffff; padding:20px; border:1px solid #000000; }
//             .button { display:inline-block; background:#000000; color:#ffffff; padding:15px 30px; text-decoration:none; margin:20px 0; font-weight:600; }
//             .info-section { background:#ffffff; border:1px solid #000000; padding:20px; margin:25px 0; }
//             .footer { background:#f5f5f5; padding:20px; text-align:center; color:#000000; font-size:14px; border-top:1px solid #000000; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1 style="margin:0;">Welcome to Blue Sip</h1>
//               <p style="margin:10px 0 0;">Your Premium Hydration Journey Starts Here</p>
//             </div>
            
//             <div class="content">
//               <h2 style="color:#000000;">Hello ${name}</h2>
//               <p style="color:#000000; line-height:1.8;">
//                 Welcome to the Blue Sip family. We're thrilled to have you join thousands of hydration enthusiasts who've discovered the perfect way to stay refreshed, healthy, and eco-conscious.
//               </p>
              
//               <div class="welcome-box">
//                 <h3 style="color:#000000; margin:0 0 10px;">Exclusive Welcome Gift</h3>
//                 <p style="margin:10px 0; font-size:18px; color:#000000;">
//                   Get <strong style="font-size:24px;">10% OFF</strong> your first order
//                 </p>
//                 <p style="margin:10px 0; font-size:14px; color:#000000;">Use code:</p>
//                 <div style="background:#ffffff; padding:12px; border:1px solid #000000; display:inline-block; margin-top:5px;">
//                   <strong style="color:#000000; font-size:20px; letter-spacing:2px;">WELCOME10</strong>
//                 </div>
//               </div>

//               <h3 style="color:#000000; margin:30px 0 15px;">Why You'll Love Blue Sip:</h3>
//               <div class="features-grid">
//                 <div class="feature-item">
//                   <h4 style="margin:0 0 8px; color:#000000;">24-Hour Cold</h4>
//                   <p style="margin:0; font-size:14px; color:#000000;">Advanced insulation keeps drinks ice-cold all day long</p>
//                 </div>
//                 <div class="feature-item">
//                   <h4 style="margin:0 0 8px; color:#000000;">100% Leak-Proof</h4>
//                   <p style="margin:0; font-size:14px; color:#000000;">Precision-engineered sealing technology</p>
//                 </div>
//                 <div class="feature-item">
//                   <h4 style="margin:0 0 8px; color:#000000;">Eco-Friendly</h4>
//                   <p style="margin:0; font-size:14px; color:#000000;">BPA-free stainless steel construction</p>
//                 </div>
//                 <div class="feature-item">
//                   <h4 style="margin:0 0 8px; color:#000000;">2-Year Warranty</h4>
//                   <p style="margin:0; font-size:14px; color:#000000;">Comprehensive protection guarantee</p>
//                 </div>
//               </div>

//               <div style="text-align:center; margin:30px 0;">
//                 <a href="http://localhost:3000/products" class="button">
//                   Shop Water Bottles Now
//                 </a>
//               </div>

             
              
//               <p style="color:#000000; font-size:14px; line-height:1.6;">
//                 If you have any questions about our water bottles or need hydration advice, our support team is here to help at <a href="mailto:support@bluesip.com" style="color:#000000; text-decoration:underline;">support@bluesip.com</a>
//               </p>
              
//               <p style="color:#000000; margin-top:25px;">
//                 Stay hydrated, stay healthy<br/>
//                 <strong>The Blue Sip Team</strong>
//               </p>
//             </div>
            
//             <div class="footer">
//               <p style="margin:0 0 5px;">2024 Blue Sip. All rights reserved.</p>
//               <p style="margin:0;">support@bluesip.com | 91 89306-87697</p>
//               <p style="margin:10px 0 0; font-size:12px;">You're receiving this because you created an account with Blue Sip.</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     }

//     const result = await transporter.sendMail(mailOptions)
//     console.log('Welcome email sent successfully:', result.messageId)
//     return result
//   } catch (error) {
//     console.error('Error sending welcome email:', error)
//     throw new Error('Failed to send welcome email')
//   }
// }

// // Send password reset success email
// export const sendPasswordResetSuccessEmail = async (email, name) => {
//   try {
//     const transporter = createTransport()

//     const mailOptions = {
//       from: {
//         name: 'Blue Sip',
//         address: process.env.EMAIL_USER
//       },
//       to: email,
//       subject: 'Password Reset Successful - Blue Sip Account Secured',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Password Reset Successful</title>
//           <style>
//             body { font-family: Arial, sans-serif; background:#ffffff; padding:20px; margin:0; line-height:1.6; color:#000000; }
//             .container { max-width:600px; margin:auto; background:#ffffff; border:1px solid #000000; }
//             .header { background:#000000; color:#ffffff; padding:30px; text-align:center; }
//             .content { padding:30px; background:#ffffff; }
//             .success-box { background:#ffffff; border:2px solid #000000; padding:25px; text-align:center; margin:25px 0; }
//             .info-section { background:#ffffff; border:1px solid #000000; padding:20px; margin:25px 0; }
//             .button { display:inline-block; background:#000000; color:#ffffff; padding:15px 30px; text-decoration:none; font-weight:600; }
//             .footer { background:#f5f5f5; padding:20px; text-align:center; color:#000000; font-size:14px; border-top:1px solid #000000; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1 style="margin:0;">Password Reset Successful</h1>
//               <p style="margin:10px 0 0;">Your Blue Sip Account is Now Secure</p>
//             </div>
            
//             <div class="content">
//               <h2 style="color:#000000;">Hello ${name}</h2>
//               <p style="color:#000000; line-height:1.8;">
//                 Great news! Your password has been successfully reset. Your Blue Sip account is now secured with your new password, and you can log in anytime to continue your hydration journey.
//               </p>
              
//               <div class="success-box">
//                 <h3 style="color:#000000; margin:0 0 10px;">Password Updated Successfully</h3>
//                 <p style="margin:0; color:#000000;">You can now log in to your account using your new password and enjoy all Blue Sip features.</p>
//               </div>

//               <div class="info-section">
//                 <h4 style="color:#000000; margin:0 0 15px;">Security Best Practices</h4>
//                 <ul style="color:#000000; margin:0; padding-left:20px; line-height:1.8;">
//                   <li>Use a strong, unique password that you don't use elsewhere</li>
//                   <li>Never share your password with anyone, including Blue Sip staff</li>
//                   <li>Always log out from shared or public devices</li>
//                   <li>Enable two-factor authentication if available</li>
//                   <li>Contact us immediately if you notice any suspicious activity</li>
//                 </ul>
//               </div>

//               <div class="info-section">
//                 <h4 style="color:#000000; margin:0 0 10px;">Didn't Reset Your Password?</h4>
//                 <p style="color:#000000; margin:0; line-height:1.6;">
//                   If you didn't request this password reset, your account may be compromised. Please contact our support team immediately at <a href="mailto:support@bluesip.com" style="color:#000000; text-decoration:underline;">support@bluesip.com</a> or call us at <strong>91 89306-87697</strong>.
//                 </p>
//               </div>

//               <div style="text-align:center; margin:30px 0;">
//                 <a href="http://localhost:3000/login" class="button">
//                   Login to Your Account
//                 </a>
//               </div>

//               <div class="info-section">
//                 <h4 style="color:#000000; margin:0 0 10px;">Pro Tip</h4>
//                 <p style="color:#000000; margin:0; line-height:1.6;">
//                   Consider using a password manager to generate and store strong, unique passwords for all your online accounts. This helps keep your digital life secure.
//                 </p>
//               </div>
              
//               <p style="color:#000000; font-size:14px; line-height:1.6;">
//                 Thank you for keeping your Blue Sip account secure. If you have any questions or need assistance, our support team is always here to help.
//               </p>
              
//               <p style="color:#000000; margin-top:25px;">
//                 Stay hydrated, stay secure<br/>
//                 <strong>The Blue Sip Security Team</strong>
//               </p>
//             </div>
            
//             <div class="footer">
//               <p style="margin:0 0 5px;">2024 Blue Sip. All rights reserved.</p>
//               <p style="margin:0;">support@bluesip.com | 91 89306-87697</p>
//               <p style="margin:10px 0 0; font-size:12px;">This email was sent because your password was reset on your Blue Sip account.</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     }

//     const result = await transporter.sendMail(mailOptions)
//     console.log('Password reset success email sent successfully:', result.messageId)
//     return result
//   } catch (error) {
//     console.error('Error sending password reset success email:', error)
//     throw new Error('Failed to send password reset success email')
//   }
// }

// // Send OTP email
// export const sendOTPEmail = async (email, otp, name) => {
//   try {
//     const transporter = createTransport()

//     const mailOptions = {
//       from: {
//         name: 'Blue Sip',
//         address: process.env.EMAIL_USER
//       },
//       to: email,
//       subject: 'Verify Your Blue Sip Account - OTP Code',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Verify Your Account</title>
//           <style>
//             body { font-family: Arial, sans-serif; background:#ffffff; padding:20px; margin:0; line-height:1.6; color:#000000; }
//             .container { max-width:600px; margin:auto; background:#ffffff; border:1px solid #000000; }
//             .header { background:#000000; color:#ffffff; padding:30px; text-align:center; }
//             .content { padding:30px; background:#ffffff; }
//             .otp-box { background:#ffffff; border:2px solid #000000; padding:30px; text-align:center; margin:25px 0; }
//             .otp-code { font-size:42px; font-weight:700; color:#000000; letter-spacing:8px; margin:15px 0; font-family: 'Courier New', monospace; background:#f5f5f5; padding:15px 25px; border:1px solid #000000; display:inline-block; }
//             .info-section { background:#ffffff; border:1px solid #000000; padding:20px; margin:25px 0; }
//             .button { display:inline-block; background:#000000; color:#ffffff; padding:15px 30px; text-decoration:none; font-weight:600; }
//             .footer { background:#f5f5f5; padding:20px; text-align:center; color:#000000; font-size:14px; border-top:1px solid #000000; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1 style="margin:0;">Account Verification</h1>
//               <p style="margin:10px 0 0;">Secure Your Blue Sip Account</p>
//             </div>
            
//             <div class="content">
//               <h2 style="color:#000000;">Hello ${name}</h2>
//               <p style="color:#000000; line-height:1.8;">
//                 Thank you for registering with Blue Sip. We're excited to have you join our hydration community. To complete your account verification and unlock all features, please use the verification code below:
//               </p>
              
//               <div class="otp-box">
//                 <p style="margin:0 0 10px; color:#000000; font-size:14px; font-weight:600; text-transform:uppercase;">Your Verification Code</p>
//                 <div class="otp-code">${otp}</div>
//                 <p style="margin:15px 0 0; color:#000000; font-size:14px;">Enter this code in the verification screen</p>
//               </div>

//               <div class="info-section">
//                 <p style="margin:0; color:#000000; font-weight:600;">
//                   Important: This code will expire in <strong>10 minutes</strong> for your security.
//                 </p>
//               </div>

//               <div class="info-section">
//                 <h4 style="margin:0 0 15px; color:#000000;">Security Tips</h4>
//                 <ul style="margin:0; padding-left:20px; color:#000000; line-height:1.8;">
//                   <li>Never share this code with anyone, including Blue Sip support</li>
//                   <li>We will never ask for your OTP via phone or email</li>
//                   <li>If you didn't request this code, please ignore this email</li>
//                   <li>Your account security is important to us</li>
//                 </ul>
//               </div>

//               <div class="info-section">
//                 <p style="margin:0; color:#000000; font-size:14px; line-height:1.6;">
//                   <strong>Didn't request this verification?</strong><br/>
//                   If you didn't create a Blue Sip account, you can safely ignore this email. Your email address will not be used without verification.
//                 </p>
//               </div>

//               <div style="text-align:center; margin:30px 0;">
//                 <a href="http://localhost:3000/verify-otp" class="button">
//                   Verify Your Account Now
//                 </a>
//               </div>
              
//               <p style="color:#000000; font-size:14px; line-height:1.6;">
//                 Need help? Contact our support team at <a href="mailto:support@bluesip.com" style="color:#000000; text-decoration:underline;">support@bluesip.com</a>
//               </p>

//               <p style="color:#000000; margin-top:25px;">
//                 Welcome aboard<br/>
//                 <strong>The Blue Sip Team</strong>
//               </p>
//             </div>

//             <div class="footer">
//               <p style="margin:0 0 5px;">2024 Blue Sip. All rights reserved.</p>
//               <p style="margin:0;">support@bluesip.com | 91 89306-87697</p>
//               <p style="margin:10px 0 0; font-size:12px;">This is an automated verification email. Please do not reply.</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     }

//     const result = await transporter.sendMail(mailOptions)
//     console.log('OTP verification email sent successfully:', result.messageId)
//     return result
//   } catch (error) {
//     console.error('Error sending OTP email:', error)
//     throw new Error('Failed to send OTP email')
//   }
// }

// // Send password reset email
// export const sendPasswordResetEmail = async (email, otp, name) => {
//   try {
//     const transporter = createTransport()

//     const mailOptions = {
//       from: {
//         name: 'Blue Sip',
//         address: process.env.EMAIL_USER
//       },
//       to: email,
//       subject: 'Reset Your Blue Sip Password - OTP Code',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Reset Your Password</title>
//           <style>
//             body { font-family: Arial, sans-serif; background:#ffffff; padding:20px; margin:0; line-height:1.6; color:#000000; }
//             .container { max-width:600px; margin:auto; background:#ffffff; border:1px solid #000000; }
//             .header { background:#000000; color:#ffffff; padding:30px; text-align:center; }
//             .content { padding:30px; background:#ffffff; }
//             .otp-box { background:#ffffff; border:2px solid #000000; padding:30px; text-align:center; margin:25px 0; }
//             .otp-code { font-size:42px; font-weight:700; color:#000000; letter-spacing:8px; margin:15px 0; font-family: 'Courier New', monospace; background:#f5f5f5; padding:15px 25px; border:1px solid #000000; display:inline-block; }
//             .info-section { background:#ffffff; border:1px solid #000000; padding:20px; margin:25px 0; }
//             .button { display:inline-block; background:#000000; color:#ffffff; padding:15px 30px; text-decoration:none; font-weight:600; }
//             .footer { background:#f5f5f5; padding:20px; text-align:center; color:#000000; font-size:14px; border-top:1px solid #000000; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1 style="margin:0;">Password Reset Request</h1>
//               <p style="margin:10px 0 0;">Secure Your Blue Sip Account</p>
//             </div>
            
//             <div class="content">
//               <h2 style="color:#000000;">Hello ${name}</h2>
//               <p style="color:#000000; line-height:1.8;">
//                 We received a request to reset your password for your Blue Sip account. Use the OTP code below to create a new password and regain access to your account.
//               </p>
              
//               <div class="otp-box">
//                 <p style="margin:0 0 10px; color:#000000; font-size:14px; font-weight:600; text-transform:uppercase;">Your Password Reset Code</p>
//                 <div class="otp-code">${otp}</div>
//                 <p style="margin:15px 0 0; color:#000000; font-size:14px;">Enter this code to reset your password</p>
//               </div>

//               <div class="info-section">
//                 <p style="margin:0; color:#000000; font-weight:600;">
//                   Time Sensitive: This code will expire in <strong>10 minutes</strong> for security reasons.
//                 </p>
//               </div>

//               <div class="info-section">
//                 <h4 style="color:#000000; margin:0 0 10px;">Security Notice</h4>
//                 <p style="color:#000000; margin:0; line-height:1.6;">
//                   If you didn't request a password reset, please <strong>ignore this email</strong>. Your password will remain unchanged and your account stays secure. If you're concerned about unauthorized access, please contact us immediately.
//                 </p>
//               </div>

//               <div class="info-section">
//                 <h4 style="color:#000000; margin:0 0 15px;">Password Reset Steps</h4>
//                 <ol style="margin:0; padding-left:20px; color:#000000; line-height:1.8;">
//                   <li>Copy the OTP code above</li>
//                   <li>Go to the password reset page</li>
//                   <li>Enter the OTP code</li>
//                   <li>Create a strong new password</li>
//                   <li>Confirm and save your new password</li>
//                 </ol>
//               </div>

//               <div style="text-align:center; margin:30px 0;">
//                 <a href="http://localhost:3000/reset-password" class="button">
//                   Reset Password Now
//                 </a>
//               </div>

//               <div class="info-section">
//                 <h4 style="color:#000000; margin:0 0 10px;">Create a Strong Password</h4>
//                 <ul style="margin:0; padding-left:20px; color:#000000; line-height:1.8;">
//                   <li>Use at least 8 characters</li>
//                   <li>Include uppercase and lowercase letters</li>
//                   <li>Add numbers and special characters</li>
//                   <li>Avoid common words or personal information</li>
//                   <li>Don't reuse passwords from other accounts</li>
//                 </ul>
//               </div>
              
//               <p style="color:#000000; font-size:14px; line-height:1.6;">
//                 Need help? Contact our support team at <a href="mailto:support@bluesip.com" style="color:#000000; text-decoration:underline;">support@bluesip.com</a> or call 91 89306-87697.
//               </p>
              
//               <p style="color:#000000; margin-top:25px;">
//                 Stay secure<br/>
//                 <strong>The Blue Sip Security Team</strong>
//               </p>
//             </div>
            
//             <div class="footer">
//               <p style="margin:0 0 5px;">2024 Blue Sip. All rights reserved.</p>
//               <p style="margin:0;">support@bluesip.com | 91 89306-87697</p>
//               <p style="margin:10px 0 0; font-size:12px;">This is an automated security email. Please do not reply.</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     }

//     const result = await transporter.sendMail(mailOptions)
//     console.log('Password reset email sent successfully:', result.messageId)
//     return result
//   } catch (error) {
//     console.error('Error sending password reset email:', error)
//     throw new Error('Failed to send password reset email')
//   }
// }

// // Send order confirmation email to CUSTOMER
// export const sendOrderConfirmationEmail = async (email, orderData) => {
//   try {
//     const transporter = createTransport()

//     const itemsHtml = orderData.items.map(item => `
//       <tr>
//         <td style="padding:12px; border-bottom:1px solid #000000;">
//           <strong style="color:#000000;">${item.product?.name || 'Product'}</strong><br/>
//           <span style="color:#000000; font-size:14px;">Quantity: ${item.quantity}</span>
//         </td>
//         <td align="right" style="padding:12px; border-bottom:1px solid #000000; font-weight:600; color:#000000;">
//           ₹${(item.price * item.quantity).toFixed(2)}
//         </td>
//       </tr>
//     `).join("")

//     const mailOptions = {
//       from: {
//         name: "Blue Sip",
//         address: process.env.EMAIL_USER
//       },
//       to: email,
//       subject: `Order Confirmed - ${orderData.orderNumber}`,
//       html: `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Order Confirmation</title>
//         <style>
//           body { font-family: Arial, sans-serif; background:#ffffff; padding:20px; margin:0; line-height:1.6; color:#000000; }
//           .container { max-width:600px; margin:auto; background:#ffffff; border:1px solid #000000; }
//           .header { background:#000000; color:#ffffff; padding:30px; text-align:center; }
//           .content { padding:30px; background:#ffffff; }
//           .order-box { background:#ffffff; border:2px solid #000000; padding:25px; margin:25px 0; }
//           .info-section { background:#ffffff; border:1px solid #000000; padding:20px; margin:25px 0; }
//           .button { display:inline-block; background:#000000; color:#ffffff; padding:15px 30px; text-decoration:none; font-weight:600; }
//           .footer { background:#f5f5f5; padding:20px; text-align:center; color:#000000; font-size:14px; border-top:1px solid #000000; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1 style="margin:0;">Order Confirmed</h1>
//             <p style="margin:10px 0 0;">Thank you for your order</p>
//           </div>
          
//           <div class="content">
//             <h2 style="color:#000000;">Hello ${orderData.customerName}</h2>
//             <p style="color:#000000; line-height:1.8;">
//               Your order has been successfully placed and confirmed. We're preparing it for shipment. Get ready to enjoy your premium Blue Sip water bottles.
//             </p>

//             <div class="order-box">
//               <h3 style="margin:0 0 15px; color:#000000;">Order Details</h3>
//               <table width="100%" style="border-collapse:collapse;">
//                 <tr>
//                   <td style="padding:8px 0; color:#000000;">Order Number:</td>
//                   <td align="right" style="padding:8px 0; font-weight:700; color:#000000; font-size:16px;">${orderData.orderNumber}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding:8px 0; color:#000000;">Order Date:</td>
//                   <td align="right" style="padding:8px 0; font-weight:600; color:#000000;">${new Date(orderData.createdAt).toLocaleDateString('en-IN', { 
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric'
//                   })}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding:8px 0; color:#000000;">Payment Method:</td>
//                   <td align="right" style="padding:8px 0; font-weight:600; color:#000000; text-transform:capitalize;">${orderData.paymentMethod}</td>
//                 </tr>
//               </table>
//             </div>

//             <h3 style="color:#000000; margin:30px 0 15px;">Order Items</h3>
//             <table width="100%" style="border-collapse:collapse; border:1px solid #000000;">
//               ${itemsHtml}
//               <tr>
//                 <td style="padding:15px; background:#f5f5f5; font-weight:700; color:#000000; border-top:2px solid #000000;">Total Amount:</td>
//                 <td align="right" style="padding:15px; background:#f5f5f5; font-weight:700; color:#000000; font-size:20px; border-top:2px solid #000000;">₹${orderData.total.toFixed(2)}</td>
//               </tr>
//             </table>

//             <h3 style="color:#000000; margin:30px 0 15px;">Delivery Address</h3>
//             <div style="background:#ffffff; border:1px solid #000000; padding:20px;">
//               <p style="margin:0; line-height:1.8; color:#000000;">
//                 <strong style="color:#000000;">${orderData.shippingAddress.fullName}</strong><br/>
//                 ${orderData.shippingAddress.address || orderData.shippingAddress.street || ''}<br/>
//                 ${orderData.shippingAddress.city} - ${orderData.shippingAddress.zipCode}<br/>
//                 <strong>Phone:</strong> ${orderData.shippingAddress.phone}
//               </p>
//             </div>

//             <div class="info-section">
//               <h4 style="margin:0 0 10px; color:#000000;">Delivery Information</h4>
//               <p style="margin:0; color:#000000; line-height:1.6;">
//                 Your order will be delivered in <strong>3-5 working days</strong>. .
//               </p>
//             </div>

           

//             <div class="info-section">
//               <h4 style="margin:0 0 10px; color:#000000;">Need Help?</h4>
//               <p style="margin:0; color:#000000; font-size:14px; line-height:1.6;">
//                 If you have any questions about your order, please contact us at 
//                 <a href="mailto:support@bluesip.com" style="color:#000000; text-decoration:underline;">support@bluesip.com</a> or call <strong>91 89306-87697</strong>
//               </p>
//             </div>

//             <p style="color:#000000; margin-top:30px;">
//               Stay hydrated<br/>
//               <strong>The Blue Sip Team</strong>
//             </p>
//           </div>

//           <div class="footer">
//             <p style="margin:0 0 5px;">2024 Blue Sip. All rights reserved.</p>
//             <p style="margin:0;">support@bluesip.com | 91 89306-87697</p>
//             <p style="margin:10px 0 0; font-size:12px;">Order confirmation for ${orderData.orderNumber}</p>
//           </div>
//         </div>
//       </body>
//       </html>
//       `
//     }

//     const result = await transporter.sendMail(mailOptions)
//     console.log("Customer confirmation email sent:", result.messageId)
//     return result

//   } catch (error) {
//     console.error("Customer email error:", error)
//     throw error
//   }
// }

// // Send order notification email to ADMIN
// export const sendAdminOrderNotification = async (orderData) => {
//   try {
//     const transporter = createTransport();

//     if (!process.env.ADMIN_EMAIL) {
//       throw new Error("ADMIN_EMAIL not defined in .env file");
//     }

//     const itemsHtml = orderData.items.map(item => `
//       <tr>
//         <td style="padding:10px; border-bottom:1px solid #000000;">
//           <strong style="color:#000000;">${item.product?.name || 'Product'}</strong><br/>
//           <span style="color:#000000; font-size:14px;">Qty: ${item.quantity}</span>
//         </td>
//         <td align="right" style="padding:10px; border-bottom:1px solid #000000; font-weight:600; color:#000000;">
//           ₹${(item.price * item.quantity).toFixed(2)}
//         </td>
//       </tr>
//     `).join("")

//     const mailOptions = {
//       from: {
//         name: "Blue Sip Order System",
//         address: process.env.EMAIL_USER
//       },
//       to: process.env.ADMIN_EMAIL,
//       subject: `New Order Received - Order #${orderData.orderNumber}`,
//       html: `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>New Order Alert</title>
//         <style>
//           body { font-family: Arial, sans-serif; background:#ffffff; padding:20px; margin:0; line-height:1.6; color:#000000; }
//           .container { max-width:600px; margin:auto; background:#ffffff; border:2px solid #000000; }
//           .header { background:#000000; color:#ffffff; padding:30px; text-align:center; }
//           .content { padding:30px; background:#ffffff; }
//           .alert-box { background:#ffffff; border:2px solid #000000; padding:20px; margin:20px 0; text-align:center; }
//           .info-section { background:#ffffff; border:1px solid #000000; padding:15px; margin:15px 0; }
//           .button { display:inline-block; background:#000000; color:#ffffff; padding:15px 30px; text-decoration:none; font-weight:600; }
//           .footer { background:#f5f5f5; padding:20px; text-align:center; color:#000000; font-size:12px; border-top:1px solid #000000; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1 style="margin:0;">New Order Alert</h1>
//             <p style="margin:10px 0 0;">Action Required - Process This Order</p>
//           </div>

//           <div class="content">
//             <div class="alert-box">
//               <p style="margin:0; color:#000000; font-weight:700; font-size:16px;">
//                 URGENT: A new customer order has been placed and paid successfully
//               </p>
//             </div>

//             <h3 style="color:#000000; margin:20px 0 10px;">Order Information</h3>
//             <div class="info-section">
//               <table width="100%" style="border-collapse:collapse;">
//                 <tr>
//                   <td style="padding:6px 0; color:#000000;">Order Number:</td>
//                   <td align="right" style="padding:6px 0; font-weight:700; color:#000000; font-size:16px;">${orderData.orderNumber}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding:6px 0; color:#000000;">Order Date:</td>
//                   <td align="right" style="padding:6px 0; font-weight:600; color:#000000;">${new Date(orderData.createdAt).toLocaleString('en-IN', {
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric',
//                     hour: '2-digit',
//                     minute: '2-digit'
//                   })}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding:6px 0; color:#000000;">Total Amount:</td>
//                   <td align="right" style="padding:6px 0; font-weight:700; color:#000000; font-size:18px;">₹${orderData.total.toFixed(2)}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding:6px 0; color:#000000;">Payment Status:</td>
//                   <td align="right" style="padding:6px 0;">
//                     <span style="background:#000000; color:#ffffff; padding:4px 12px; font-weight:600; font-size:12px;">PAID</span>
//                   </td>
//                 </tr>
//               </table>
//             </div>

//             <h3 style="color:#000000; margin:25px 0 10px;">Customer Details</h3>
//             <div class="info-section">
//               <p style="margin:0; line-height:1.8; color:#000000;">
//                 <strong>Name:</strong> ${orderData.customerName}<br/>
//                 <strong>Email:</strong> ${orderData.customerEmail}<br/>
//                 <strong>Phone:</strong> ${orderData.shippingAddress.phone}
//               </p>
//             </div>

//             <h3 style="color:#000000; margin:25px 0 10px;">Ordered Items</h3>
//             <table width="100%" style="border-collapse:collapse; border:1px solid #000000;">
//               ${itemsHtml}
//               <tr>
//                 <td style="padding:12px; background:#f5f5f5; font-weight:700; color:#000000; border-top:2px solid #000000;">Total:</td>
//                 <td align="right" style="padding:12px; background:#f5f5f5; font-weight:700; color:#000000; font-size:18px; border-top:2px solid #000000;">₹${orderData.total.toFixed(2)}</td>
//               </tr>
//             </table>

//             <h3 style="color:#000000; margin:25px 0 10px;">Delivery Address</h3>
//             <div style="background:#ffffff; border:1px solid #000000; padding:15px;">
//               <p style="margin:0; line-height:1.8; color:#000000;">
//                 <strong>${orderData.shippingAddress.fullName}</strong><br/>
//                 ${orderData.shippingAddress.address || orderData.shippingAddress.street || ''}<br/>
//                 ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state || ''} ${orderData.shippingAddress.zipCode}<br/>
//                 Phone: ${orderData.shippingAddress.phone}
//               </p>
//             </div>

//             <div class="info-section">
//               <h4 style="margin:0 0 10px; color:#000000;">Next Steps:</h4>
//               <ol style="margin:0; padding-left:20px; color:#000000; line-height:1.8;">
//                 <li>Verify payment in Razorpay dashboard</li>
//                 <li>Check inventory for ordered items</li>
//                 <li>Prepare shipment and generate label</li>
//                 <li>Update order status to "Shipped"</li>
//                 <li>Send tracking info to customer</li>
//               </ol>
//             </div>

//             <div style="text-align:center; margin:30px 0;">
//               <a href="http://localhost:3001/admin/orders" class="button">
//                 View Order in Admin Panel
//               </a>
//             </div>

//             <div class="info-section">
//               <p style="margin:0; color:#000000; font-size:14px; line-height:1.6;">
//                 <strong>Reminder:</strong> Please process this order within 24 hours to maintain customer satisfaction and delivery timelines.
//               </p>
//             </div>
//           </div>

//           <div class="footer">
//             <p style="margin:0 0 5px;"><strong>Blue Sip Admin System</strong></p>
//             <p style="margin:0;">This is an automated notification. Please do not reply to this email.</p>
//             <p style="margin:10px 0 0;">Admin Dashboard: <a href="http://localhost:3001" style="color:#000000; text-decoration:underline;">http://localhost:3001</a></p>
//           </div>
//         </div>
//       </body>
//       </html>
//       `
//     };

//     const result = await transporter.sendMail(mailOptions);
//     console.log("Admin order notification sent successfully:", result.messageId);
//     return result;

//   } catch (error) {
//     console.error("Admin email error:", error.message);
//     throw error;
//   }
// };

// // Send contact form email to admin
// export const sendContactFormEmail = async (contactData) => {
//   try {
//     const transporter = createTransport()

//     const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER

//     const mailOptions = {
//       from: {
//         name: 'Blue Sip Contact Form',
//         address: process.env.EMAIL_USER
//       },
//       to: adminEmail,
//       replyTo: contactData.email,
//       subject: `New Contact Form: ${contactData.subject}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>New Contact Form Submission</title>
//           <style>
//             body { font-family: Arial, sans-serif; background:#ffffff; padding:20px; margin:0; line-height:1.6; color:#000000; }
//             .container { max-width:600px; margin:auto; background:#ffffff; border:2px solid #000000; }
//             .header { background:#000000; color:#ffffff; padding:30px; text-align:center; }
//             .content { padding:30px; background:#ffffff; }
//             .info-section { background:#ffffff; border:1px solid #000000; padding:20px; margin:20px 0; }
//             .message-box { background:#f5f5f5; border:1px solid #000000; padding:20px; margin:20px 0; }
//             .footer { background:#f5f5f5; padding:20px; text-align:center; color:#000000; font-size:14px; border-top:1px solid #000000; }
//             .label { font-weight:600; color:#000000; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1 style="margin:0;">New Customer Message</h1>
//               <p style="margin:10px 0 0;">Contact Form Submission</p>
//             </div>
            
//             <div class="content">
//               <h2 style="color:#000000;">You have received a new message</h2>
//               <p style="color:#000000; line-height:1.8;">
//                 A customer has submitted a contact form on the Blue Sip website. Please review the details below and respond promptly to maintain excellent customer service.
//               </p>
              
//               <div class="info-section">
//                 <h3 style="margin:0 0 15px; color:#000000;">Contact Information</h3>
//                 <p style="margin:0 0 10px;">
//                   <span class="label">Customer Name:</span><br/>
//                   <strong style="color:#000000; font-size:16px;">${contactData.name}</strong>
//                 </p>
//                 <p style="margin:0 0 10px;">
//                   <span class="label">Email Address:</span><br/>
//                   <a href="mailto:${contactData.email}" style="color:#000000; font-weight:600; text-decoration:underline;">${contactData.email}</a>
//                 </p>
//                 <p style="margin:0 0 10px;">
//                   <span class="label">Subject:</span><br/>
//                   <strong style="color:#000000;">${contactData.subject}</strong>
//                 </p>
//                 <p style="margin:0;">
//                   <span class="label">Submitted On:</span><br/>
//                   <span style="color:#000000; font-weight:600;">${new Date(contactData.submittedAt).toLocaleString('en-IN', { 
//                     timeZone: 'Asia/Kolkata',
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric',
//                     hour: '2-digit',
//                     minute: '2-digit'
//                   })} IST</span>
//                 </p>
//               </div>
              
//               <div class="message-box">
//                 <h3 style="margin:0 0 15px; color:#000000;">Customer Message</h3>
//                 <div style="background:#ffffff; padding:20px; border:1px solid #000000;">
//                   <p style="white-space: pre-wrap; margin:0; font-size:15px; line-height:1.8; color:#000000;">${contactData.message}</p>
//                 </div>
//               </div>

//               <div class="info-section">
//                 <h4 style="margin:0 0 10px; color:#000000;">Action Required</h4>
//                 <p style="margin:0; color:#000000; line-height:1.6;">
//                   Please respond to this customer inquiry within <strong>24 hours</strong> to maintain our excellent customer service standards and build customer trust.
//                 </p>
//               </div>

//               <div class="info-section">
//                 <h4 style="margin:0 0 15px; color:#000000;">Quick Response Tips</h4>
//                 <ul style="margin:0; padding-left:20px; color:#000000; line-height:1.8;">
//                   <li>Address the customer by name for a personal touch</li>
//                   <li>Reference their specific question or concern</li>
//                   <li>Provide helpful information about our water bottles</li>
//                   <li>Include relevant product links if applicable</li>
//                   <li>End with an invitation for further questions</li>
//                   <li>Use a friendly and professional tone</li>
//                 </ul>
//               </div>

//               <div class="info-section">
//                 <h4 style="margin:0 0 10px; color:#000000;">How to Reply</h4>
//                 <p style="margin:0; color:#000000; line-height:1.6;">
//                   You can reply directly to this email to respond to <strong>${contactData.name}</strong>. The customer's email (<strong>${contactData.email}</strong>) is set as the reply-to address for your convenience.
//                 </p>
//               </div>
//             </div>
  
//           </div>
//         </body>
//         </html>
//       `
//     }

//     const result = await transporter.sendMail(mailOptions)
//     console.log('Contact form email sent to admin successfully:', result.messageId)
//     return result
//   } catch (error) {
//     console.error('Error sending contact form email to admin:', error)
//     throw new Error('Failed to send contact form email to admin')
//   }
// }





import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Get FRONTEND_URL from environment variables
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

const ADMIN_PANEL_URL = process.env.ADMIN_PANEL_URL || 'http://localhost:3001'
// Safe URL join (double slash avoid)
const adminOrdersLink = `${ADMIN_PANEL_URL.replace(/\/$/, '')}/orders`
// Create transporter
const createTransport = () => {
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
    const transporter = createTransport()

    const mailOptions = {
      from: {
        name: 'Blue Sip',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Welcome to Blue Sip - Your Hydration Journey Begins',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Blue Sip</title>
          <style>
            body { font-family: Arial, sans-serif; background:#ffffff; padding:20px; margin:0; line-height:1.6; color:#000000; }
            .container { max-width:600px; margin:auto; background:#ffffff; border:1px solid #000000; }
            .header { background:#000000; color:#ffffff; padding:30px; text-align:center; }
            .content { padding:30px; background:#ffffff; }
            .welcome-box { background:#ffffff; border:2px solid #000000; padding:25px; text-align:center; margin:25px 0; }
            .features-grid { display:grid; grid-template-columns:1fr 1fr; gap:15px; margin:25px 0; }
            .feature-item { background:#ffffff; padding:20px; border:1px solid #000000; }
            .button { display:inline-block; background:#000000; color:#ffffff; padding:15px 30px; text-decoration:none; margin:20px 0; font-weight:600; }
            .info-section { background:#ffffff; border:1px solid #000000; padding:20px; margin:25px 0; }
            .footer { background:#f5f5f5; padding:20px; text-align:center; color:#000000; font-size:14px; border-top:1px solid #000000; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0;">Welcome to Blue Sip</h1>
              <p style="margin:10px 0 0;">Your Premium Hydration Journey Starts Here</p>
            </div>
            
            <div class="content">
              <h2 style="color:#000000;">Hello ${name}</h2>
              <p style="color:#000000; line-height:1.8;">
                Welcome to the Blue Sip family. We're thrilled to have you join thousands of hydration enthusiasts who've discovered the perfect way to stay refreshed, healthy, and eco-conscious.
              </p>
              
              <div class="welcome-box">
                <h3 style="color:#000000; margin:0 0 10px;">Exclusive Welcome Gift</h3>
                <p style="margin:10px 0; font-size:18px; color:#000000;">
                  Get <strong style="font-size:24px;">10% OFF</strong> your first order
                </p>
                <p style="margin:10px 0; font-size:14px; color:#000000;">Use code:</p>
                <div style="background:#ffffff; padding:12px; border:1px solid #000000; display:inline-block; margin-top:5px;">
                  <strong style="color:#000000; font-size:20px; letter-spacing:2px;">WELCOME10</strong>
                </div>
              </div>

              <h3 style="color:#000000; margin:30px 0 15px;">Why You'll Love Blue Sip:</h3>
              <div class="features-grid">
                <div class="feature-item">
                  <h4 style="margin:0 0 8px; color:#000000;">24-Hour Cold</h4>
                  <p style="margin:0; font-size:14px; color:#000000;">Advanced insulation keeps drinks ice-cold all day long</p>
                </div>
                <div class="feature-item">
                  <h4 style="margin:0 0 8px; color:#000000;">100% Leak-Proof</h4>
                  <p style="margin:0; font-size:14px; color:#000000;">Precision-engineered sealing technology</p>
                </div>
                <div class="feature-item">
                  <h4 style="margin:0 0 8px; color:#000000;">Eco-Friendly</h4>
                  <p style="margin:0; font-size:14px; color:#000000;">BPA-free stainless steel construction</p>
                </div>
                <div class="feature-item">
                  <h4 style="margin:0 0 8px; color:#000000;">2-Year Warranty</h4>
                  <p style="margin:0; font-size:14px; color:#000000;">Comprehensive protection guarantee</p>
                </div>
              </div>

              <div style="text-align:center; margin:30px 0;">
                <a href="${FRONTEND_URL}/products" class="button">
                  Shop Water Bottles Now
                </a>
              </div>
              <p style="color:#000000; font-size:14px; line-height:1.6;">
                If you have any questions about our water bottles or need hydration advice, our support team is here to help at <a href="mailto:support@bluesip.com" style="color:#000000; text-decoration:underline;">support@bluesip.com</a>
              </p>
              
              <p style="color:#000000; margin-top:25px;">
                Stay hydrated, stay healthy<br/>
                <strong>The Blue Sip Team</strong>
              </p>
            </div>
            
            <div class="footer">
              <p style="margin:0 0 5px;">2024 Blue Sip. All rights reserved.</p>
              <p style="margin:0;">support@bluesip.com | 91 89306-87697</p>
              <p style="margin:10px 0 0; font-size:12px;">You're receiving this because you created an account with Blue Sip.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Welcome email sent successfully:', result.messageId)
    return result
  } catch (error) {
    console.error('Error sending welcome email:', error)
    throw new Error('Failed to send welcome email')
  }
}

// Send password reset success email
export const sendPasswordResetSuccessEmail = async (email, name) => {
  try {
    const transporter = createTransport()

    const mailOptions = {
      from: {
        name: 'Blue Sip',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Password Reset Successful - Blue Sip Account Secured',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Successful</title>
          <style>
            body { font-family: Arial, sans-serif; background:#ffffff; padding:20px; margin:0; line-height:1.6; color:#000000; }
            .container { max-width:600px; margin:auto; background:#ffffff; border:1px solid #000000; }
            .header { background:#000000; color:#ffffff; padding:30px; text-align:center; }
            .content { padding:30px; background:#ffffff; }
            .success-box { background:#ffffff; border:2px solid #000000; padding:25px; text-align:center; margin:25px 0; }
            .info-section { background:#ffffff; border:1px solid #000000; padding:20px; margin:25px 0; }
            .button { display:inline-block; background:#000000; color:#ffffff; padding:15px 30px; text-decoration:none; font-weight:600; }
            .footer { background:#f5f5f5; padding:20px; text-align:center; color:#000000; font-size:14px; border-top:1px solid #000000; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0;">Password Reset Successful</h1>
              <p style="margin:10px 0 0;">Your Blue Sip Account is Now Secure</p>
            </div>
            
            <div class="content">
              <h2 style="color:#000000;">Hello ${name}</h2>
              <p style="color:#000000; line-height:1.8;">
                Great news! Your password has been successfully reset. Your Blue Sip account is now secured with your new password, and you can log in anytime to continue your hydration journey.
              </p>
              
              <div class="success-box">
                <h3 style="color:#000000; margin:0 0 10px;">Password Updated Successfully</h3>
                <p style="margin:0; color:#000000;">You can now log in to your account using your new password and enjoy all Blue Sip features.</p>
              </div>

              <div class="info-section">
                <h4 style="color:#000000; margin:0 0 15px;">Security Best Practices</h4>
                <ul style="color:#000000; margin:0; padding-left:20px; line-height:1.8;">
                  <li>Use a strong, unique password that you don't use elsewhere</li>
                  <li>Never share your password with anyone, including Blue Sip staff</li>
                  <li>Always log out from shared or public devices</li>
                  <li>Enable two-factor authentication if available</li>
                  <li>Contact us immediately if you notice any suspicious activity</li>
                </ul>
              </div>

              <div class="info-section">
                <h4 style="color:#000000; margin:0 0 10px;">Didn't Reset Your Password?</h4>
                <p style="color:#000000; margin:0; line-height:1.6;">
                  If you didn't request this password reset, your account may be compromised. Please contact our support team immediately at <a href="mailto:support@bluesip.com" style="color:#000000; text-decoration:underline;">support@bluesip.com</a> or call us at <strong>91 89306-87697</strong>.
                </p>
              </div>

              <div style="text-align:center; margin:30px 0;">
                <a href="${FRONTEND_URL}/login" class="button">
                  Login to Your Account
                </a>
              </div>

              <div class="info-section">
                <h4 style="color:#000000; margin:0 0 10px;">Pro Tip</h4>
                <p style="color:#000000; margin:0; line-height:1.6;">
                  Consider using a password manager to generate and store strong, unique passwords for all your online accounts. This helps keep your digital life secure.
                </p>
              </div>
              
              <p style="color:#000000; font-size:14px; line-height:1.6;">
                Thank you for keeping your Blue Sip account secure. If you have any questions or need assistance, our support team is always here to help.
              </p>
              
              <p style="color:#000000; margin-top:25px;">
                Stay hydrated, stay secure<br/>
                <strong>The Blue Sip Security Team</strong>
              </p>
            </div>
            
            <div class="footer">
              <p style="margin:0 0 5px;">2024 Blue Sip. All rights reserved.</p>
              <p style="margin:0;">support@bluesip.com | 91 89306-87697</p>
              <p style="margin:10px 0 0; font-size:12px;">This email was sent because your password was reset on your Blue Sip account.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Password reset success email sent successfully:', result.messageId)
    return result
  } catch (error) {
    console.error('Error sending password reset success email:', error)
    throw new Error('Failed to send password reset success email')
  }
}

// Send OTP email
export const sendOTPEmail = async (email, otp, name) => {
  try {
    const transporter = createTransport()

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
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Account</title>
          <style>
            body { font-family: Arial, sans-serif; background:#ffffff; padding:20px; margin:0; line-height:1.6; color:#000000; }
            .container { max-width:600px; margin:auto; background:#ffffff; border:1px solid #000000; }
            .header { background:#000000; color:#ffffff; padding:30px; text-align:center; }
            .content { padding:30px; background:#ffffff; }
            .otp-box { background:#ffffff; border:2px solid #000000; padding:30px; text-align:center; margin:25px 0; }
            .otp-code { font-size:42px; font-weight:700; color:#000000; letter-spacing:8px; margin:15px 0; font-family: 'Courier New', monospace; background:#f5f5f5; padding:15px 25px; border:1px solid #000000; display:inline-block; }
            .info-section { background:#ffffff; border:1px solid #000000; padding:20px; margin:25px 0; }
            .button { display:inline-block; background:#000000; color:#ffffff; padding:15px 30px; text-decoration:none; font-weight:600; }
            .footer { background:#f5f5f5; padding:20px; text-align:center; color:#000000; font-size:14px; border-top:1px solid #000000; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0;">Account Verification</h1>
              <p style="margin:10px 0 0;">Secure Your Blue Sip Account</p>
            </div>
            
            <div class="content">
              <h2 style="color:#000000;">Hello ${name}</h2>
              <p style="color:#000000; line-height:1.8;">
                Thank you for registering with Blue Sip. We're excited to have you join our hydration community. To complete your account verification and unlock all features, please use the verification code below:
              </p>
              
              <div class="otp-box">
                <p style="margin:0 0 10px; color:#000000; font-size:14px; font-weight:600; text-transform:uppercase;">Your Verification Code</p>
                <div class="otp-code">${otp}</div>
                <p style="margin:15px 0 0; color:#000000; font-size:14px;">Enter this code in the verification screen</p>
              </div>

              <div class="info-section">
                <p style="margin:0; color:#000000; font-weight:600;">
                  Important: This code will expire in <strong>10 minutes</strong> for your security.
                </p>
              </div>

              <div class="info-section">
                <h4 style="margin:0 0 15px; color:#000000;">Security Tips</h4>
                <ul style="margin:0; padding-left:20px; color:#000000; line-height:1.8;">
                  <li>Never share this code with anyone, including Blue Sip support</li>
                  <li>We will never ask for your OTP via phone or email</li>
                  <li>If you didn't request this code, please ignore this email</li>
                  <li>Your account security is important to us</li>
                </ul>
              </div>

              <div class="info-section">
                <p style="margin:0; color:#000000; font-size:14px; line-height:1.6;">
                  <strong>Didn't request this verification?</strong><br/>
                  If you didn't create a Blue Sip account, you can safely ignore this email. Your email address will not be used without verification.
                </p>
              </div>


              <p style="color:#000000; font-size:14px; line-height:1.6;">
                Need help? Contact our support team at <a href="mailto:support@bluesip.com" style="color:#000000; text-decoration:underline;">support@bluesip.com</a>
              </p>

              <p style="color:#000000; margin-top:25px;">
                Welcome aboard<br/>
                <strong>The Blue Sip Team</strong>
              </p>
            </div>

            <div class="footer">
              <p style="margin:0 0 5px;">2024 Blue Sip. All rights reserved.</p>
              <p style="margin:0;">support@bluesip.com | 91 89306-87697</p>
              <p style="margin:10px 0 0; font-size:12px;">This is an automated verification email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('OTP verification email sent successfully:', result.messageId)
    return result
  } catch (error) {
    console.error('Error sending OTP email:', error)
    throw new Error('Failed to send OTP email')
  }
}

// Send password reset email
export const sendPasswordResetEmail = async (email, otp, name) => {
  try {
    const transporter = createTransport()

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
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; background:#ffffff; padding:20px; margin:0; line-height:1.6; color:#000000; }
            .container { max-width:600px; margin:auto; background:#ffffff; border:1px solid #000000; }
            .header { background:#000000; color:#ffffff; padding:30px; text-align:center; }
            .content { padding:30px; background:#ffffff; }
            .otp-box { background:#ffffff; border:2px solid #000000; padding:30px; text-align:center; margin:25px 0; }
            .otp-code { font-size:42px; font-weight:700; color:#000000; letter-spacing:8px; margin:15px 0; font-family: 'Courier New', monospace; background:#f5f5f5; padding:15px 25px; border:1px solid #000000; display:inline-block; }
            .info-section { background:#ffffff; border:1px solid #000000; padding:20px; margin:25px 0; }
            .button { display:inline-block; background:#000000; color:#ffffff; padding:15px 30px; text-decoration:none; font-weight:600; }
            .footer { background:#f5f5f5; padding:20px; text-align:center; color:#000000; font-size:14px; border-top:1px solid #000000; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0;">Password Reset Request</h1>
              <p style="margin:10px 0 0;">Secure Your Blue Sip Account</p>
            </div>
            
            <div class="content">
              <h2 style="color:#000000;">Hello ${name}</h2>
              <p style="color:#000000; line-height:1.8;">
                We received a request to reset your password for your Blue Sip account. Use the OTP code below to create a new password and regain access to your account.
              </p>
              
              <div class="otp-box">
                <p style="margin:0 0 10px; color:#000000; font-size:14px; font-weight:600; text-transform:uppercase;">Your Password Reset Code</p>
                <div class="otp-code">${otp}</div>
                <p style="margin:15px 0 0; color:#000000; font-size:14px;">Enter this code to reset your password</p>
              </div>

              <div class="info-section">
                <p style="margin:0; color:#000000; font-weight:600;">
                  Time Sensitive: This code will expire in <strong>10 minutes</strong> for security reasons.
                </p>
              </div>

              <div class="info-section">
                <h4 style="color:#000000; margin:0 0 10px;">Security Notice</h4>
                <p style="color:#000000; margin:0; line-height:1.6;">
                  If you didn't request a password reset, please <strong>ignore this email</strong>. Your password will remain unchanged and your account stays secure. If you're concerned about unauthorized access, please contact us immediately.
                </p>
              </div>

              <div class="info-section">
                <h4 style="color:#000000; margin:0 0 15px;">Password Reset Steps</h4>
                <ol style="margin:0; padding-left:20px; color:#000000; line-height:1.8;">
                  <li>Copy the OTP code above</li>
                  <li>Go to the password reset page</li>
                  <li>Enter the OTP code</li>
                  <li>Create a strong new password</li>
                  <li>Confirm and save your new password</li>
                </ol>
              </div>
              <div class="info-section">
                <h4 style="color:#000000; margin:0 0 10px;">Create a Strong Password</h4>
                <ul style="margin:0; padding-left:20px; color:#000000; line-height:1.8;">
                  <li>Use at least 8 characters</li>
                  <li>Include uppercase and lowercase letters</li>
                  <li>Add numbers and special characters</li>
                  <li>Avoid common words or personal information</li>
                  <li>Don't reuse passwords from other accounts</li>
                </ul>
              </div>
              
              <p style="color:#000000; font-size:14px; line-height:1.6;">
                Need help? Contact our support team at <a href="mailto:support@bluesip.com" style="color:#000000; text-decoration:underline;">support@bluesip.com</a> or call 91 89306-87697.
              </p>
              
              <p style="color:#000000; margin-top:25px;">
                Stay secure<br/>
                <strong>The Blue Sip Security Team</strong>
              </p>
            </div>
            
            <div class="footer">
              <p style="margin:0 0 5px;">2024 Blue Sip. All rights reserved.</p>
              <p style="margin:0;">support@bluesip.com | 91 89306-87697</p>
              <p style="margin:10px 0 0; font-size:12px;">This is an automated security email. Please do not reply.</p>
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

// Send order confirmation email to CUSTOMER
export const sendOrderConfirmationEmail = async (email, orderData) => {
  try {
    const transporter = createTransport()

    const itemsHtml = orderData.items.map(item => `
      <tr>
        <td style="padding:12px; border-bottom:1px solid #000000;">
          <strong style="color:#000000;">${item.product?.name || 'Product'}</strong><br/>
          <span style="color:#000000; font-size:14px;">Quantity: ${item.quantity}</span>
        </td>
        <td align="right" style="padding:12px; border-bottom:1px solid #000000; font-weight:600; color:#000000;">
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
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; background:#ffffff; padding:20px; margin:0; line-height:1.6; color:#000000; }
          .container { max-width:600px; margin:auto; background:#ffffff; border:1px solid #000000; }
          .header { background:#000000; color:#ffffff; padding:30px; text-align:center; }
          .content { padding:30px; background:#ffffff; }
          .order-box { background:#ffffff; border:2px solid #000000; padding:25px; margin:25px 0; }
          .info-section { background:#ffffff; border:1px solid #000000; padding:20px; margin:25px 0; }
          .button { display:inline-block; background:#000000; color:#ffffff; padding:15px 30px; text-decoration:none; font-weight:600; }
          .footer { background:#f5f5f5; padding:20px; text-align:center; color:#000000; font-size:14px; border-top:1px solid #000000; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0;">Order Confirmed</h1>
            <p style="margin:10px 0 0;">Thank you for your order</p>
          </div>
          
          <div class="content">
            <h2 style="color:#000000;">Hello ${orderData.customerName}</h2>
            <p style="color:#000000; line-height:1.8;">
              Your order has been successfully placed and confirmed. We're preparing it for shipment. Get ready to enjoy your premium Blue Sip water bottles.
            </p>

            <div class="order-box">
              <h3 style="margin:0 0 15px; color:#000000;">Order Details</h3>
              <table width="100%" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0; color:#000000;">Order Number:</td>
                  <td align="right" style="padding:8px 0; font-weight:700; color:#000000; font-size:16px;">${orderData.orderNumber}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0; color:#000000;">Order Date:</td>
                  <td align="right" style="padding:8px 0; font-weight:600; color:#000000;">${new Date(orderData.createdAt).toLocaleDateString('en-IN', { 
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0; color:#000000;">Payment Method:</td>
                  <td align="right" style="padding:8px 0; font-weight:600; color:#000000; text-transform:capitalize;">${orderData.paymentMethod}</td>
                </tr>
              </table>
            </div>

            <h3 style="color:#000000; margin:30px 0 15px;">Order Items</h3>
            <table width="100%" style="border-collapse:collapse; border:1px solid #000000;">
              ${itemsHtml}
              <tr>
                <td style="padding:15px; background:#f5f5f5; font-weight:700; color:#000000; border-top:2px solid #000000;">Total Amount:</td>
                <td align="right" style="padding:15px; background:#f5f5f5; font-weight:700; color:#000000; font-size:20px; border-top:2px solid #000000;">₹${orderData.total.toFixed(2)}</td>
              </tr>
            </table>

            <h3 style="color:#000000; margin:30px 0 15px;">Delivery Address</h3>
            <div style="background:#ffffff; border:1px solid #000000; padding:20px;">
              <p style="margin:0; line-height:1.8; color:#000000;">
                <strong style="color:#000000;">${orderData.shippingAddress.fullName}</strong><br/>
                ${orderData.shippingAddress.address || orderData.shippingAddress.street || ''}<br/>
                ${orderData.shippingAddress.city} - ${orderData.shippingAddress.zipCode}<br/>
                <strong>Phone:</strong> ${orderData.shippingAddress.phone}
              </p>
            </div>

            <div class="info-section">
              <h4 style="margin:0 0 10px; color:#000000;">Delivery Information</h4>
              <p style="margin:0; color:#000000; line-height:1.6;">
                Your order will be delivered in <strong>3-5 working days</strong>.
              </p>
            </div>

            <div class="info-section">
              <h4 style="margin:0 0 10px; color:#000000;">Need Help?</h4>
              <p style="margin:0; color:#000000; font-size:14px; line-height:1.6;">
                If you have any questions about your order, please contact us at 
                <a href="mailto:support@bluesip.com" style="color:#000000; text-decoration:underline;">support@bluesip.com</a> or call <strong>91 89306-87697</strong>
              </p>
            </div>

            <p style="color:#000000; margin-top:30px;">
              Stay hydrated<br/>
              <strong>The Blue Sip Team</strong>
            </p>
          </div>

          <div class="footer">
            <p style="margin:0 0 5px;">2024 Blue Sip. All rights reserved.</p>
            <p style="margin:0;">support@bluesip.com | 91 89306-87697</p>
            <p style="margin:10px 0 0; font-size:12px;">Order confirmation for ${orderData.orderNumber}</p>
          </div>
        </div>
      </body>
      </html>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Customer confirmation email sent:", result.messageId)
    return result

  } catch (error) {
    console.error("Customer email error:", error)
    throw error
  }
}

// Send order notification email to ADMIN
export const sendAdminOrderNotification = async (orderData) => {
  try {
    const transporter = createTransport();

    if (!process.env.ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL not defined in .env file");
    }

    const itemsHtml = orderData.items.map(item => `
      <tr>
        <td style="padding:10px; border-bottom:1px solid #000000;">
          <strong style="color:#000000;">${item.product?.name || 'Product'}</strong><br/>
          <span style="color:#000000; font-size:14px;">Qty: ${item.quantity}</span>
        </td>
        <td align="right" style="padding:10px; border-bottom:1px solid #000000; font-weight:600; color:#000000;">
          ₹${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join("")

    const mailOptions = {
      from: {
        name: "Blue Sip Order System",
        address: process.env.EMAIL_USER
      },
      to: process.env.ADMIN_EMAIL,
      subject: `New Order Received - Order #${orderData.orderNumber}`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Alert</title>
        <style>
          body { font-family: Arial, sans-serif; background:#ffffff; padding:20px; margin:0; line-height:1.6; color:#000000; }
          .container { max-width:600px; margin:auto; background:#ffffff; border:2px solid #000000; }
          .header { background:#000000; color:#ffffff; padding:30px; text-align:center; }
          .content { padding:30px; background:#ffffff; }
          .alert-box { background:#ffffff; border:2px solid #000000; padding:20px; margin:20px 0; text-align:center; }
          .info-section { background:#ffffff; border:1px solid #000000; padding:15px; margin:15px 0; }
          .button { display:inline-block; background:#000000; color:#ffffff; padding:15px 30px; text-decoration:none; font-weight:600; }
          .footer { background:#f5f5f5; padding:20px; text-align:center; color:#000000; font-size:12px; border-top:1px solid #000000; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0;">New Order Alert</h1>
            <p style="margin:10px 0 0;">Action Required - Process This Order</p>
          </div>

          <div class="content">
            <div class="alert-box">
              <p style="margin:0; color:#000000; font-weight:700; font-size:16px;">
                URGENT: A new customer order has been placed and paid successfully
              </p>
            </div>

            <h3 style="color:#000000; margin:20px 0 10px;">Order Information</h3>
            <div class="info-section">
              <table width="100%" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:6px 0; color:#000000;">Order Number:</td>
                  <td align="right" style="padding:6px 0; font-weight:700; color:#000000; font-size:16px;">${orderData.orderNumber}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#000000;">Order Date:</td>
                  <td align="right" style="padding:6px 0; font-weight:600; color:#000000;">${new Date(orderData.createdAt).toLocaleString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#000000;">Total Amount:</td>
                  <td align="right" style="padding:6px 0; font-weight:700; color:#000000; font-size:18px;">₹${orderData.total.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; color:#000000;">Payment Status:</td>
                  <td align="right" style="padding:6px 0;">
                    <span style="background:#000000; color:#ffffff; padding:4px 12px; font-weight:600; font-size:12px;">PAID</span>
                  </td>
                </tr>
              </table>
            </div>

            <h3 style="color:#000000; margin:25px 0 10px;">Customer Details</h3>
            <div class="info-section">
              <p style="margin:0; line-height:1.8; color:#000000;">
                <strong>Name:</strong> ${orderData.customerName}<br/>
                <strong>Email:</strong> ${orderData.customerEmail}<br/>
                <strong>Phone:</strong> ${orderData.shippingAddress.phone}
              </p>
            </div>

            <h3 style="color:#000000; margin:25px 0 10px;">Ordered Items</h3>
            <table width="100%" style="border-collapse:collapse; border:1px solid #000000;">
              ${itemsHtml}
              <tr>
                <td style="padding:12px; background:#f5f5f5; font-weight:700; color:#000000; border-top:2px solid #000000;">Total:</td>
                <td align="right" style="padding:12px; background:#f5f5f5; font-weight:700; color:#000000; font-size:18px; border-top:2px solid #000000;">₹${orderData.total.toFixed(2)}</td>
              </tr>
            </table>

            <h3 style="color:#000000; margin:25px 0 10px;">Delivery Address</h3>
            <div style="background:#ffffff; border:1px solid #000000; padding:15px;">
              <p style="margin:0; line-height:1.8; color:#000000;">
                <strong>${orderData.shippingAddress.fullName}</strong><br/>
                ${orderData.shippingAddress.address || orderData.shippingAddress.street || ''}<br/>
                ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state || ''} ${orderData.shippingAddress.zipCode}<br/>
                Phone: ${orderData.shippingAddress.phone}
              </p>
            </div>

            <div class="info-section">
              <h4 style="margin:0 0 10px; color:#000000;">Next Steps:</h4>
              <ol style="margin:0; padding-left:20px; color:#000000; line-height:1.8;">
                <li>Verify payment in Razorpay dashboard</li>
                <li>Check inventory for ordered items</li>
                <li>Prepare shipment and generate label</li>
                <li>Update order status to "Shipped"</li>
                <li>Send tracking info to customer</li>
              </ol>
            </div>
            <div style="text-align:center; margin:30px 0;">
              <a href="${adminOrdersLink}" class="button">
    View Order in Admin Panel
  </a>
            </div>

            <div class="info-section">
              <p style="margin:0; color:#000000; font-size:14px; line-height:1.6;">
                <strong>Reminder:</strong> Please process this order within 24 hours to maintain customer satisfaction and delivery timelines.
              </p>
            </div>
          </div>

          <div class="footer">
            <p style="margin:0 0 5px;"><strong>Blue Sip Admin System</strong></p>
            <p style="margin:0;">This is an automated notification. Please do not reply to this email.</p>
            <p style="margin:10px 0 0;">Admin Dashboard: <a href="http://localhost:3001" style="color:#000000; text-decoration:underline;">http://localhost:3001</a></p>
          </div>
        </div>
      </body>
      </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Admin order notification sent successfully:", result.messageId);
    return result;

  } catch (error) {
    console.error("Admin email error:", error.message);
    throw error;
  }
};

// Send contact form email to admin
export const sendContactFormEmail = async (contactData) => {
  try {
    const transporter = createTransport()

    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER

    const mailOptions = {
      from: {
        name: 'Blue Sip Contact Form',
        address: process.env.EMAIL_USER
      },
      to: adminEmail,
      replyTo: contactData.email,
      subject: `New Contact Form: ${contactData.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; background:#ffffff; padding:20px; margin:0; line-height:1.6; color:#000000; }
            .container { max-width:600px; margin:auto; background:#ffffff; border:2px solid #000000; }
            .header { background:#000000; color:#ffffff; padding:30px; text-align:center; }
            .content { padding:30px; background:#ffffff; }
            .info-section { background:#ffffff; border:1px solid #000000; padding:20px; margin:20px 0; }
            .message-box { background:#f5f5f5; border:1px solid #000000; padding:20px; margin:20px 0; }
            .footer { background:#f5f5f5; padding:20px; text-align:center; color:#000000; font-size:14px; border-top:1px solid #000000; }
            .label { font-weight:600; color:#000000; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0;">New Customer Message</h1>
              <p style="margin:10px 0 0;">Contact Form Submission</p>
            </div>
            
            <div class="content">
              <h2 style="color:#000000;">You have received a new message</h2>
              <p style="color:#000000; line-height:1.8;">
                A customer has submitted a contact form on the Blue Sip website. Please review the details below and respond promptly to maintain excellent customer service.
              </p>
              
              <div class="info-section">
                <h3 style="margin:0 0 15px; color:#000000;">Contact Information</h3>
                <p style="margin:0 0 10px;">
                  <span class="label">Customer Name:</span><br/>
                  <strong style="color:#000000; font-size:16px;">${contactData.name}</strong>
                </p>
                <p style="margin:0 0 10px;">
                  <span class="label">Email Address:</span><br/>
                  <a href="mailto:${contactData.email}" style="color:#000000; font-weight:600; text-decoration:underline;">${contactData.email}</a>
                </p>
                <p style="margin:0 0 10px;">
                  <span class="label">Subject:</span><br/>
                  <strong style="color:#000000;">${contactData.subject}</strong>
                </p>
                <p style="margin:0;">
                  <span class="label">Submitted On:</span><br/>
                  <span style="color:#000000; font-weight:600;">${new Date(contactData.submittedAt).toLocaleString('en-IN', { 
                    timeZone: 'Asia/Kolkata',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })} IST</span>
                </p>
              </div>
              
              <div class="message-box">
                <h3 style="margin:0 0 15px; color:#000000;">Customer Message</h3>
                <div style="background:#ffffff; padding:20px; border:1px solid #000000;">
                  <p style="white-space: pre-wrap; margin:0; font-size:15px; line-height:1.8; color:#000000;">${contactData.message}</p>
                </div>
              </div>

              <div class="info-section">
                <h4 style="margin:0 0 10px; color:#000000;">Action Required</h4>
                <p style="margin:0; color:#000000; line-height:1.6;">
                  Please respond to this customer inquiry within <strong>24 hours</strong> to maintain our excellent customer service standards and build customer trust.
                </p>
              </div>

              <div class="info-section">
                <h4 style="margin:0 0 15px; color:#000000;">Quick Response Tips</h4>
                <ul style="margin:0; padding-left:20px; color:#000000; line-height:1.8;">
                  <li>Address the customer by name for a personal touch</li>
                  <li>Reference their specific question or concern</li>
                  <li>Provide helpful information about our water bottles</li>
                  <li>Include relevant product links if applicable</li>
                  <li>End with an invitation for further questions</li>
                  <li>Use a friendly and professional tone</li>
                </ul>
              </div>

              <div class="info-section">
                <h4 style="margin:0 0 10px; color:#000000;">How to Reply</h4>
                <p style="margin:0; color:#000000; line-height:1.6;">
                  You can reply directly to this email to respond to <strong>${contactData.name}</strong>. The customer's email (<strong>${contactData.email}</strong>) is set as the reply-to address for your convenience.
                </p>
              </div>
            </div>
  
          </div>
        </body>
        </html>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Contact form email sent to admin successfully:', result.messageId)
    return result
  } catch (error) {
    console.error('Error sending contact form email to admin:', error)
    throw new Error('Failed to send contact form email to admin')
  }
}

// ============================================
// NEW FUNCTIONS: Order Cancellation Emails
// ============================================

// Send order cancellation email to CUSTOMER


// ======================================================
// CUSTOMER CANCELLATION EMAIL
// ======================================================



// Send Customer Order Cancellation Email
export const sendCustomerOrderCancellationEmail = async (email, orderData) => {
  try {
    const transporter = createTransport()

    const itemsHtml = orderData.items.map(item => `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;">
          <strong>${item.product?.name || 'Product'}</strong><br/>
          <span style="color:#6b7280;font-size:14px;">Quantity: ${item.quantity}</span>
        </td>
        <td align="right" style="padding:12px;border-bottom:1px solid #e5e7eb;font-weight:600;">
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
      subject: `Order Cancelled - #${orderData.orderNumber}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family:Arial,sans-serif;background:#f9fafb;margin:0;padding:20px;">

<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
  
  <!-- Header -->
  <div style="background:#dc2626;color:#ffffff;padding:30px 20px;text-align:center;">
    <h1 style="margin:0;font-size:28px;">Order Cancelled</h1>
  </div>

  <!-- Content -->
  <div style="padding:30px 20px;">
    
    <p style="font-size:16px;color:#374151;margin:0 0 20px 0;">
      Hello <strong>${orderData.customerName}</strong>,
    </p>

    <p style="font-size:16px;color:#374151;margin:0 0 10px 0;">
      Your order <strong>#${orderData.orderNumber}</strong> has been cancelled successfully.
    </p>

    <div style="background:#fee2e2;border-left:4px solid #dc2626;padding:15px;margin:20px 0;border-radius:4px;">
      <p style="margin:0;color:#991b1b;font-size:14px;">
        <strong>Cancelled On:</strong> ${new Date(orderData.cancelledAt || Date.now()).toLocaleString('en-IN', {
          dateStyle: 'long',
          timeStyle: 'short'
        })}
      </p>
      ${orderData.cancelReason ? `
        <p style="margin:10px 0 0 0;color:#991b1b;font-size:14px;">
          <strong>Reason:</strong> ${orderData.cancelReason}
        </p>
      ` : ''}
    </div>

    <h3 style="color:#111827;margin:30px 0 15px 0;font-size:18px;">Cancelled Items</h3>

    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      ${itemsHtml}
      <tr style="background:#f9fafb;">
        <td style="padding:15px;"><strong style="font-size:16px;">Total Amount</strong></td>
        <td align="right" style="padding:15px;">
          <strong style="font-size:18px;color:#dc2626;">₹${orderData.total.toFixed(2)}</strong>
        </td>
      </tr>
    </table>

    <h3 style="color:#111827;margin:30px 0 15px 0;font-size:18px;">Refund Status</h3>

    <div style="background:#dbeafe;border-left:4px solid #3b82f6;padding:15px;margin:0 0 20px 0;border-radius:4px;">
      <p style="margin:0;color:#1e40af;font-size:14px;">
        ${orderData.paymentStatus === 'paid'
          ? '💰 Your refund will be initiated within <strong>24 hours</strong> and will be credited to your account within <strong>5-7 working days</strong>.'
          : '✅ No payment was deducted, so no refund is required.'
        }
      </p>
    </div>

    ${orderData.paymentStatus === 'paid' ? `
      <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:15px;margin:0 0 30px 0;border-radius:4px;">
        <p style="margin:0;color:#92400e;font-size:13px;">
          <strong>Note:</strong> Refunds will be processed to the original payment method used during purchase.
        </p>
      </div>
    ` : ''}

    <div style="text-align:center;margin:30px 0;">
      <a href="${FRONTEND_URL}/products" 
         style="display:inline-block;background:#000000;color:#ffffff;padding:14px 30px;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px;">
        Continue Shopping
      </a>
    </div>

    <p style="font-size:14px;color:#6b7280;margin:30px 0 0 0;text-align:center;">
      If you have any questions or concerns, please don't hesitate to contact our support team.
    </p>

  </div>

  <!-- Footer -->
  <div style="background:#f9fafb;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
    <p style="margin:0;color:#6b7280;font-size:14px;">
      Thanks for choosing <strong>Blue Sip</strong> 💙
    </p>
    <p style="margin:10px 0 0 0;color:#9ca3af;font-size:12px;">
      © ${new Date().getFullYear()} Blue Sip. All rights reserved.
    </p>
  </div>

</div>

</body>
</html>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("✅ Customer cancellation email sent:", result.messageId)
    return result

  } catch (error) {
    console.error("❌ Customer cancellation email error:", error.message)
    throw error
  }
}

// Send Admin Order Cancellation Notification
export const sendAdminOrderCancellationNotification = async (orderData) => {
  try {
    const transporter = createTransport()

    if (!process.env.ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL not defined in .env file")
    }

    const itemsHtml = orderData.items.map(item => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #e5e7eb;">
          <strong>${item.product?.name || 'Product'}</strong><br/>
          <span style="color:#6b7280;font-size:13px;">Qty: ${item.quantity} × ₹${item.price.toFixed(2)}</span>
        </td>
        <td align="right" style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:600;">
          ₹${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join("")

    const mailOptions = {
      from: {
        name: "Blue Sip Admin System",
        address: process.env.EMAIL_USER
      },
      to: process.env.ADMIN_EMAIL,
      subject: `⚠️ Order Cancelled - #${orderData.orderNumber}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family:Arial,sans-serif;background:#f9fafb;margin:0;padding:20px;">

<div style="max-width:650px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
  
  <!-- Header -->
  <div style="background:#dc2626;color:#ffffff;padding:25px 20px;">
    <h1 style="margin:0;font-size:24px;">⚠️ Order Cancellation Alert</h1>
    <p style="margin:10px 0 0 0;font-size:14px;opacity:0.9;">Admin Notification</p>
  </div>

  <!-- Content -->
  <div style="padding:30px 20px;">
    
    <div style="background:#fee2e2;border-left:4px solid #dc2626;padding:15px;margin:0 0 25px 0;border-radius:4px;">
      <p style="margin:0;color:#991b1b;font-size:15px;">
        <strong>A customer has cancelled their order</strong>
      </p>
    </div>

    <h3 style="color:#111827;margin:0 0 15px 0;font-size:18px;">Order Information</h3>

    <table width="100%" style="margin-bottom:25px;">
      <tr>
        <td style="padding:8px 0;color:#6b7280;font-size:14px;width:40%;">Order ID:</td>
        <td style="padding:8px 0;color:#111827;font-weight:600;font-size:14px;">
          #${orderData.orderNumber}
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#6b7280;font-size:14px;">Cancelled On:</td>
        <td style="padding:8px 0;color:#111827;font-size:14px;">
          ${new Date(orderData.cancelledAt || Date.now()).toLocaleString('en-IN', {
            dateStyle: 'long',
            timeStyle: 'short'
          })}
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#6b7280;font-size:14px;">Total Amount:</td>
        <td style="padding:8px 0;color:#dc2626;font-weight:700;font-size:16px;">
          ₹${orderData.total.toFixed(2)}
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#6b7280;font-size:14px;">Payment Status:</td>
        <td style="padding:8px 0;">
          <span style="display:inline-block;background:${orderData.paymentStatus === 'paid' ? '#dc2626' : '#6b7280'};color:#ffffff;padding:4px 12px;border-radius:4px;font-size:12px;font-weight:600;text-transform:uppercase;">
            ${orderData.paymentStatus}
          </span>
        </td>
      </tr>
      ${orderData.cancelReason ? `
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:14px;vertical-align:top;">Reason:</td>
          <td style="padding:8px 0;color:#111827;font-size:14px;">
            ${orderData.cancelReason}
          </td>
        </tr>
      ` : ''}
    </table>

    <h3 style="color:#111827;margin:0 0 15px 0;font-size:18px;">Customer Information</h3>

    <div style="background:#f9fafb;padding:15px;border-radius:6px;margin:0 0 25px 0;">
      <p style="margin:0 0 8px 0;color:#111827;font-size:14px;">
        <strong>${orderData.customerName}</strong>
      </p>
      <p style="margin:0 0 8px 0;color:#6b7280;font-size:14px;">
        📧 ${orderData.customerEmail}
      </p>
      <p style="margin:0;color:#6b7280;font-size:14px;">
        📱 ${orderData.shippingAddress.phone}
      </p>
    </div>

    <h3 style="color:#111827;margin:0 0 15px 0;font-size:18px;">Cancelled Items</h3>

    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin:0 0 25px 0;">
      ${itemsHtml}
      <tr style="background:#f9fafb;">
        <td style="padding:12px;"><strong>Total</strong></td>
        <td align="right" style="padding:12px;">
          <strong style="font-size:16px;color:#dc2626;">₹${orderData.total.toFixed(2)}</strong>
        </td>
      </tr>
    </table>

    ${orderData.paymentStatus === 'paid' ? `
      <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:15px;margin:0 0 25px 0;border-radius:4px;">
        <p style="margin:0;color:#92400e;font-size:14px;">
          <strong>⚠️ Refund Required:</strong> ₹${orderData.total.toFixed(2)}
        </p>
        <p style="margin:8px 0 0 0;color:#92400e;font-size:13px;">
          Please process the refund within 24 hours.
        </p>
      </div>
    ` : ''}

    <div style="text-align:center;margin:30px 0 20px 0;">
      <a href="${ADMIN_PANEL_URL}/admin/orders" 
         style="display:inline-block;background:#000000;color:#ffffff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:600;font-size:15px;">
        View in Admin Panel
      </a>
    </div>

  </div>

  <!-- Footer -->
  <div style="background:#f9fafb;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
    <p style="margin:0;color:#6b7280;font-size:12px;">
      Blue Sip Automated Notification System
    </p>
    <p style="margin:8px 0 0 0;color:#9ca3af;font-size:11px;">
      This is an automated email. Please do not reply.
    </p>
  </div>

</div>

</body>
</html>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("✅ Admin cancellation email sent:", result.messageId)
    return result

  } catch (error) {
    console.error("❌ Admin cancellation email error:", error.message)
    throw error
  }
}