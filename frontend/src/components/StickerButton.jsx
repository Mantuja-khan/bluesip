import React from 'react'
import { useLocation } from 'react-router-dom'
import { Palette } from 'lucide-react'

const StickerButton = ({ onClick }) => {
  const location = useLocation()

  // Only show button on home page
  if (location.pathname !== '/') return null

  return (
    <div className="fixed bottom-20 right-6 z-50">
      <button
        onClick={onClick}
        className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50"
        aria-label="Design Bottle Sticker"
      >
        <Palette className="h-5 w-5" />
        <span className="font-medium">Design Bottle Sticker</span>
      </button>
    </div>
  )
}

export default StickerButton;