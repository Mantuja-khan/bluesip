export const generateOrderNumber = () => {
  const prefix = "BS" // Blue Sip
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(100 + Math.random() * 900)

  return `${prefix}-${timestamp}-${random}`
}