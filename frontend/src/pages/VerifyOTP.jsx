import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, RefreshCw } from 'lucide-react'
import { toast } from 'react-toastify'

const VerifyOTP = () => {
  const { verifyOTP, resendOTP } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const email = location.state?.email
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [timer, setTimer] = useState(600) // 10 minutes in seconds

  useEffect(() => {
    // Redirect to register if no email is provided
    if (!email) {
      toast.error('Email not found. Please register again.')
      navigate('/register', { replace: true })
      return
    }

    // Timer countdown
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [email, navigate])

  const handleOtpChange = (value, index) => {
    // Only allow single digit
    if (value.length > 1) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').trim()
    
    // Only process if pasted data is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      
      // Focus last input
      const lastInput = document.getElementById('otp-5')
      if (lastInput) lastInput.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const otpValue = otp.join('')
    
    // Validation
    if (otpValue.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      const result = await verifyOTP(email, otpValue)
      
      console.log("VERIFY OTP RESPONSE:", result)
      
      // Check for successful verification
      if (result && (result.success === true || result.status === true || result.data?.success === true)) {
        toast.success(result.message || result.data?.message || "Email verified successfully!")
        navigate('/login', { replace: true })
      } else {
        // Handle error response
        const errorMessage = result?.message || result?.data?.message || result?.error || "Invalid OTP"
        toast.error(errorMessage)
        setOtp(['', '', '', '', '', ''])
        
        // Focus first input
        const firstInput = document.getElementById('otp-0')
        if (firstInput) firstInput.focus()
      }
    } catch (error) {
      console.error("Verify OTP error:", error)
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred during verification'
      toast.error(errorMessage)
      setOtp(['', '', '', '', '', ''])
      
      // Focus first input
      const firstInput = document.getElementById('otp-0')
      if (firstInput) firstInput.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendLoading) return
    
    setResendLoading(true)
    try {
      const result = await resendOTP(email)
      
      console.log("RESEND OTP RESPONSE:", result)
      
      // Check for successful resend
      if (result && (result.success === true || result.status === true || result.data?.success === true)) {
        toast.success(result.message || result.data?.message || "OTP resent successfully!")
        setTimer(600) // Reset timer to 10 minutes
        setOtp(['', '', '', '', '', ''])
        
        // Focus first input
        const firstInput = document.getElementById('otp-0')
        if (firstInput) firstInput.focus()
      } else {
        // Handle error response
        const errorMessage = result?.message || result?.data?.message || result?.error || "Failed to resend OTP"
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error("Resend OTP error:", error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to resend OTP'
      toast.error(errorMessage)
    } finally {
      setResendLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Don't render if no email
  if (!email) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-sip-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-blue-sip-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-gray-600">
            We've sent a 6-digit code to
          </p>
          <p className="font-medium text-blue-sip-600">
            {email}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter the 6-digit code
              </label>
              <div className="flex justify-center space-x-2" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value.replace(/\D/g, ''), index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-sip-500 focus:border-transparent outline-none"
                    autoComplete="off"
                  />
                ))}
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Code expires in: <span className="font-medium text-red-600">{formatTime(timer)}</span>
              </p>
              {timer > 0 ? (
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendLoading}
                    className="text-blue-sip-600 hover:text-blue-sip-700 font-medium disabled:opacity-50 inline-flex items-center"
                  >
                    {resendLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin mr-1" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      'Resend OTP'
                    )}
                  </button>
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium">
                  OTP has expired. Please request a new one.
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || otp.join('').length !== 6 || timer === 0}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/register', { replace: true })}
              className="text-sm text-gray-600 hover:text-gray-700"
            >
              ← Back to registration
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyOTP