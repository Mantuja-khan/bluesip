import React, { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Globe, Headphones, Award, CheckCircle, Droplets, Shield, Thermometer } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/contact/submit`, formData)
      
      if (response.data.success) {
        toast.success(response.data.message)
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Contact form error:', error)
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-blue-sip-600" />,
      title: "Email Support",
      details: "support@bluesip.com",
      description: "Get hydration help anytime, we'll respond within 24 hours",
      action: "mailto:support@bluesip.com"
    },
    {
      icon: <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-blue-sip-600" />,
      title: "Call Us",
      details: "+91 89306-87697",
      description: "Mon-Fri from 9am to 6pm IST for instant support",
      action: "tel:+91 89306-87697"
    },
    {
      icon: <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-blue-sip-600" />,
      title: "Visit Our Store",
      details: "Blue sip , Sohna  , Gurugram",
      description: "Experience our water bottles in person at our flagship store",
      action: "#"
    },
    {
      icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-sip-600" />,
      title: "Business Hours",
      details: "Monday - Friday: 9:00 AM - 6:00 PM",
      description: "Weekend support available via email and chat",
      action: "#"
    }
  ]

 const faqs = [
  {
    question: "How long does Blue Sip keep beverages hot or cold?",
    answer: "Blue Sip bottles use advanced double-wall vacuum insulation to keep drinks cold for up to 24 hours and hot for up to 12 hours. This ensures freshness, temperature stability, and clarity in every drop — all day long."
  },
  {
    question: "Are Blue Sip bottles 100% leak-proof?",
    answer: "Yes! Blue Sip bottles are designed with precision-sealed, food-grade silicone lids that provide complete leak-proof protection. You can safely carry them in backpacks, gym bags, or travel luggage without spills."
  },

  {
    question: "How do I clean my Blue Sip bottle properly?",
    answer: "For best performance, hand wash your Blue Sip bottle using warm water and mild detergent. Use a bottle brush for deep cleaning. Avoid microwave and dishwasher use to preserve insulation and long-term durability."
  },
  {
    question: "Is Blue Sip an eco-friendly brand?",
    answer: "Absolutely. Blue Sip is committed to sustainability. Our reusable bottles help reduce single-use plastic waste and support a greener planet. One Blue Sip bottle can replace thousands of disposable plastic bottles."
  },
{
  question: "Does Blue Sip provide warranty coverage?",
  answer: "Yes. Blue Sip provides a 2-day warranty from the delivery date covering manufacturing defects and sealing issues. Any claims must be reported within 48 hours of delivery."
}

]


  const supportChannels = [
    {
      icon: <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />,
      title: "Product Support",
      description: "Questions about water bottle features and usage",
      contact: "support@bluesip.com",
      response: "24 hours"
    },
    {
      icon: <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />,
      title: "Wholesale Inquiries",
      description: "Bulk orders, corporate gifting, and partnerships",
      contact: "business@bluesip.com",
      response: "48 hours"
    },
    {
      icon: <Award className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />,
      title: "Media & Press",
      description: "Press releases, product reviews, and media kits",
      contact: "press@bluesip.com",
      response: "72 hours"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-sip-50 to-blue-sip-100 py-12 sm:py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 sm:top-10 left-4 sm:left-10 w-12 sm:w-20 h-12 sm:h-20 bg-blue-sip-600 rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 sm:bottom-20 right-8 sm:right-20 w-8 sm:w-16 h-8 sm:h-16 bg-blue-sip-400 rounded-full animate-bounce"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-blue-sip-100 rounded-full text-xs sm:text-sm font-medium text-blue-sip-700 mb-4 sm:mb-6">
              <Droplets className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Hydration Support
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Contact <span className="text-blue-sip-600">Blue Sip</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions about our water bottles, need hydration advice, or want to share feedback? 
              Our hydration experts are here to help you stay perfectly hydrated.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.action}
                className="group text-center p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-blue-sip-200 hover:transform hover:-translate-y-2 block"
              >
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 rounded-full bg-blue-sip-50 group-hover:bg-blue-sip-100 group-hover:scale-110 transition-all duration-300">
                    {info.icon}
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-900 font-medium mb-1 text-xs sm:text-sm lg:text-base">
                  {info.details}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {info.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Support Channels */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-sip-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-sip-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Get Hydration Help</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field text-sm sm:text-base"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field text-sm sm:text-base"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="input-field text-sm sm:text-base"
                    placeholder="e.g., Product question, Warranty claim, Bulk order"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    className="input-field resize-none text-sm sm:text-base"
                    placeholder="Tell us about your hydration needs, product questions, or feedback..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 flex items-center justify-center space-x-2 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <Send className="h-4 w-4" />
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>

              <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <p className="text-xs sm:text-sm text-green-800 font-medium">
                    Our hydration experts typically respond within 24 hours
                  </p>
                </div>
              </div>
            </div>

            {/* Support Channels & Features */}
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  Specialized Support Channels
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  {supportChannels.map((channel, index) => (
                    <div key={index} className="group p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-blue-sip-50 transition-colors duration-300">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-full bg-white group-hover:bg-blue-sip-100 transition-colors duration-300">
                          {channel.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base">{channel.title}</h4>
                          <p className="text-gray-600 text-xs sm:text-sm mb-1">{channel.description}</p>
                          <p className="text-blue-sip-600 font-medium text-xs sm:text-sm">{channel.contact}</p>
                          <p className="text-gray-500 text-xs">Response time: {channel.response}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-blue-sip-100 rounded-full text-xs sm:text-sm font-medium text-blue-sip-700 mb-4 sm:mb-6">
              <Headphones className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Hydration FAQ
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600">
              Quick answers to common questions about our water bottles and hydration solutions
            </p>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 rounded-xl border border-gray-100 hover:border-blue-sip-200 hover:shadow-lg transition-all duration-300">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-sip-600 transition-colors">
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
    
    </div>
  )
}

export default ContactUs