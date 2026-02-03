import React from 'react';
import customize from "../assets/customize.jpeg";

const CustomBottle = () => {
  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <div className="relative h-100 sm:h-[28rem] md:h-[32rem] lg:h-[36rem] xl:h-[40rem] overflow-hidden">
        <img 
          src={customize}
          alt="Customize Water Bottles"
          className="w-full h-full 
            object-contain sm:object-cover 
            transform scale-100 sm:scale-110 md:scale-105 lg:scale-100 
            transition-transform duration-300"
        />
      </div>

      {/* Customization Content Section */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-blue-600 font-semibold tracking-widest uppercase text-sm mb-2 block">Corporate Branding</span>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Create a Lasting Impression with Every Sip</h2>
          <p className="text-gray-600 text-lg mb-8">
            Professional hydration shouldn't be generic. Add your firm's identity to our premium 
            Blue Sip bottles. Perfect for boardrooms, conferences, and luxury client welcoming.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <span className="text-blue-600 font-bold text-xl">01</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Glossy Finish</h3>
            <p className="text-gray-600">
              Water-resistant stickers that maintain clarity even when chilled. Our high-quality finish ensures your branding stays vibrant and professional.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <span className="text-blue-600 font-bold text-xl">02</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Eco-Friendly Inks</h3>
            <p className="text-gray-600">
              Sustainable printing practices for your environmentally conscious brand. Blue Sip uses only eco-friendly, non-toxic inks.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <span className="text-blue-600 font-bold text-xl">03</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Branding Options</h3>
            <p className="text-gray-600">
              Choose from various design templates, colors, and layouts. Incorporate your company logo, tagline, and brand colors seamlessly.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <span className="text-blue-600 font-bold text-xl">04</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Bulk Order Discounts</h3>
            <p className="text-gray-600">
              Competitive pricing for corporate orders. The more you order, the more you save. Perfect for large events and ongoing corporate needs.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <span className="text-blue-600 font-bold text-xl">05</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Turnaround</h3>
            <p className="text-gray-600">
              Quick production and delivery times without compromising quality. Get your custom Blue Sip bottles when you need them.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <span className="text-blue-600 font-bold text-xl">06</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Design Support</h3>
            <p className="text-gray-600">
              Our expert design team is here to help bring your vision to life. Free design consultations included with every order.
            </p>
          </div>
        </div>

        {/* Customization Process */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-12 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Customization Process</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Submit Your Design</h4>
              <p className="text-gray-600 text-sm">Share your logo, brand colors, and preferences with our team.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Review Mockup</h4>
              <p className="text-gray-600 text-sm">Receive a digital preview and approve or request changes.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Production</h4>
              <p className="text-gray-600 text-sm">We print and apply your custom labels to premium bottles.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Delivery</h4>
              <p className="text-gray-600 text-sm">Receive your custom branded Blue Sip water bottles.</p>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default CustomBottle;