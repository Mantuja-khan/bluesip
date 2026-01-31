import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const getActualPrice = (product) => {
    // Always return the actual price (discounted price if available, otherwise original price)
    if (product.isWholesale) {
      return product.wholesaleDiscountedPrice || product.finalWholesalePrice || product.wholesalePrice || product.price
    }
    return product.discountedPrice || product.finalPrice || product.price
  }

  const addToCart = (product, quantity = 1, isWholesale = false) => {
    const actualPrice = getActualPrice({ ...product, isWholesale })

    setCartItems(prev => {
      const existingItem = prev.find(item => 
        item._id === product._id && item.isWholesale === isWholesale
      )
      
      if (existingItem) {
        return prev.map(item =>
          item._id === product._id && item.isWholesale === isWholesale
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      
      return [...prev, { 
        ...product, 
        quantity, 
        price: actualPrice,
        isWholesale,
        originalPrice: product.price,
        discountedPrice: product.discountedPrice,
        finalPrice: product.finalPrice,
        wholesalePrice: product.wholesalePrice,
        wholesaleDiscountedPrice: product.wholesaleDiscountedPrice,
        finalWholesalePrice: product.finalWholesalePrice
      }]
    })
  }

  const updateQuantity = (productId, quantity, isWholesale = false) => {
    if (quantity <= 0) {
      removeFromCart(productId, isWholesale)
      return
    }
    setCartItems(prev =>
      prev.map(item =>
        item._id === productId && item.isWholesale === isWholesale 
          ? { ...item, quantity } 
          : item
      )
    )
  }

  const removeFromCart = (productId, isWholesale = false) => {
    setCartItems(prev => prev.filter(item => 
      !(item._id === productId && item.isWholesale === isWholesale)
    ))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = getActualPrice(item)
      return total + (itemPrice * item.quantity)
    }, 0)
  }

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getActualPrice
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}