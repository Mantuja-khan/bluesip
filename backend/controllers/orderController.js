import Order from "../models/Order.js"
import { generateOrderNumber } from "../utils/orderNumber.js"
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from "../utils/emailService.js"

export const createOrder = async (req, res) => {
  try {

    const orderNumber = generateOrderNumber()

    const newOrder = new Order({
      ...req.body,
      orderNumber
    })

    const savedOrder = await newOrder.save()

    // Convert Mongoose document to plain object so all fields are accessible
    const orderData = savedOrder.toObject()

    // Send Email To Customer
    await sendOrderConfirmationEmail(
      orderData.customerEmail,
      orderData
    )

    // Send Email To Admin
    await sendAdminOrderNotification(orderData)

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: savedOrder
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Order creation failed"
    })
  }
}