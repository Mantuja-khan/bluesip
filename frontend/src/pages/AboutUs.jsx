import React from 'react'
import { Droplets, Award, Users, Leaf, Heart, Globe, Target, Lightbulb, Recycle, Shield, Thermometer, Zap } from 'lucide-react'
import about from "../assets/about.png"
import about_1 from "../assets/about_1.png"
import about_2 from "../assets/about_2.png"
import about_3 from "../assets/about_3.png"
import about_4 from "../assets/about_4.png"
const AboutUs = () => {
  const values = [
    {
      icon: <Thermometer className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />,
      title: "Superior Insulation",
      description: "Advanced double-wall vacuum technology that keeps beverages at perfect temperature for hours, revolutionizing your hydration experience."
    },
    {
      icon: <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />,
      title: "Eco-Conscious",
      description: "Committed to reducing plastic waste with sustainable, reusable bottles that protect our planet while keeping you hydrated."
    },
    {
      icon: <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />,
      title: "Food-Grade Safety",
      description: "Premium 18/8 stainless steel construction that's BPA-free, ensuring pure taste and complete safety for daily hydration."
    },
    {
      icon: <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />,
      title: "Global Standards",
      description: "Meeting international quality standards while making a positive impact on hydration habits worldwide."
    }
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300",
      description: "Hydration enthusiast with 15+ years in sustainable product design, passionate about revolutionizing how we stay hydrated."
    },
    {
      name: "Michael Chen",
      role: "Head of Design",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300",
      description: "Creating beautiful, functional water bottles that inspire healthy hydration habits and complement active lifestyles."
    },
    {
      name: "Emily Rodriguez",
      role: "Sustainability Director",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300",
      description: "Leading our environmental initiatives to create eco-friendly hydration solutions for a sustainable future."
    }
  ]

  const galleryImages = [
    {
      url: about_1,
      title: "Premium Quality",
      description: "Crafted with precision"
    },
    {
      url: about_2,
      title: "Eco-Friendly",
      description: "Sustainable materials"
    },
    {
      url: about_3,
      title: "Active Lifestyle",
      description: "Perfect companion"
    },
    {
      url: about_4,
      title: "Stay Hydrated",
      description: "Anytime, anywhere"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-12 sm:py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 sm:top-10 left-4 sm:left-10 w-12 sm:w-20 h-12 sm:h-20 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 sm:bottom-20 right-8 sm:right-20 w-8 sm:w-16 h-8 sm:h-16 bg-blue-400 rounded-full animate-bounce"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-blue-100 rounded-full text-xs sm:text-sm font-medium text-blue-700 mb-4 sm:mb-6">
              <Droplets className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Our Hydration Story
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              About <span className="text-blue-600">Blue Sip</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to revolutionize hydration with premium, sustainable water bottles 
              that combine superior insulation technology, leak-proof design, and environmental responsibility.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-blue-100 rounded-full text-xs sm:text-sm font-medium text-blue-700 mb-4 sm:mb-6">
                <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Our Hydration Journey
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Redefining Hydration Excellence
              </h2>
              <div className="space-y-3 sm:space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                <p>
                  Blue Sip was born from a simple observation: people deserved better hydration solutions. 
                  In 2020, our founder Sarah Johnson noticed that most water bottles failed to maintain 
                  temperature, leaked frequently, or compromised on sustainability.
                </p>
                <p>
                  Determined to create the perfect hydration companion, she assembled a team of engineers, 
                  designers, and sustainability experts to develop water bottles with superior insulation 
                  technology, leak-proof design, and eco-friendly materials.
                </p>
                <p>
                  Today, Blue Sip represents the perfect fusion of advanced thermal technology, premium 
                  materials, and environmental consciousness. Every bottle we create keeps drinks cold 
                  for 24 hours and hot for 12 hours while reducing plastic waste.
                </p>
              </div>
              <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">24hrs</div>
                  <div className="text-xs sm:text-sm text-gray-600">Cold Retention</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">100%</div>
                  <div className="text-xs sm:text-sm text-gray-600">Leak-Proof</div>
                </div>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <img
                  src={about}
                  alt="Blue Sip Premium Water Bottles"
                  className="relative rounded-2xl shadow-2xl w-full h-64 sm:h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-blue-100 rounded-full text-xs sm:text-sm font-medium text-blue-700 mb-4 sm:mb-6">
              <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Core Values
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              What Drives Our Innovation
            </h2>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our hydration technology and sustainable practices
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {values.map((value, index) => (
              <div key={index} className="group text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-blue-200 hover:transform hover:-translate-y-2">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 rounded-full bg-gray-50 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-blue-100 rounded-full text-xs sm:text-sm font-medium text-blue-700 mb-4 sm:mb-6">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Our Products in Action
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Experience Blue Sip
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
              See how our bottles enhance every moment of your day
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {galleryImages.map((image, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-2">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-64 sm:h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-base sm:text-lg font-bold mb-1">{image.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-200">{image.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-blue-100 rounded-full text-xs sm:text-sm font-medium text-blue-700 mb-4 sm:mb-6">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Our Team
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Meet the Hydration Experts
            </h2>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate people behind Blue Sip who make superior hydration possible
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {team.map((member, index) => (
              <div key={index} className="group text-center bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-blue-200 hover:transform hover:-translate-y-2">
                <div className="relative mb-4 sm:mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full mx-auto object-cover border-4 border-blue-100 group-hover:border-blue-200 transition-colors duration-300"
                  />
                  <div className="absolute inset-0 rounded-full bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base">
                  {member.role}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Mission Section */}
      {/* <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 w-16 h-16 bg-white opacity-20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 right-8 w-20 h-20 bg-white opacity-10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-white opacity-15 rounded-full animate-ping"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-white/30 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium text-white mb-4 sm:mb-6">
              <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Our Mission
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
              Revolutionizing Hydration Worldwide
            </h2>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed text-blue-50">
              To create the world's most advanced, sustainable water bottles with superior insulation technology 
              while inspiring people to stay properly hydrated and protect our planet for future generations.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12">
              <div className="text-center p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-lg">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">1M+</div>
                <div className="text-blue-50 text-xs sm:text-sm font-semibold">Bottles Sold</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-lg">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">24hrs</div>
                <div className="text-blue-50 text-xs sm:text-sm font-semibold">Cold Retention</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-lg">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">99%</div>
                <div className="text-blue-50 text-xs sm:text-sm font-semibold">Customer Satisfaction</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-lg">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">100%</div>
                <div className="text-blue-50 text-xs sm:text-sm font-semibold">Leak-Proof</div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  )
}

export default AboutUs