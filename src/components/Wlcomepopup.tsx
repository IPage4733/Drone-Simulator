import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WelcomePopup = () => {
  const [isVisible, setIsVisible] = useState(true);  // Popup is visible by default
  const navigate = useNavigate();

  useEffect(() => {
    // Show popup on every page load/refresh after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true); // Make sure the popup is visible after the delay
    }, 1000);
    
    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, []);

  const handleClose = () => {
    setIsVisible(false);  // Hide the popup when close button is clicked
  };

  const handleRedirect = (page) => {
    navigate(page); // Navigate to the desired page
    handleClose();  // Close the popup
  };

  if (!isVisible) return null;  // Don't render the popup if isVisible is false

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={handleClose}  // Close when clicking on the background
    >
      {/* Fixed Card - No Scrolling */}
      <div
        className="relative bg-white rounded-3xl w-full max-w-lg mx-auto overflow-hidden shadow-2xl transform animate-in fade-in-3 duration-500"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-3 transition-all duration-200 shadow-md"
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>

        {/* Header with Gradient - Reduced Height */}
<div className="bg-gradient-to-r from-orange-600 to-red-500 px-8 py-4 text-white text-center relative overflow-hidden h-32">
  <div className="relative z-10 mt-6"> {/* Adjusted margin-top to move text down */}
    <h2 className="text-xl font-extrabold leading-tight text-white drop-shadow-2xl">
      Welcome to Drone Simulator!
    </h2>
  </div>
</div>



        {/* Content - Flexbox Layout */}
        <div className="p-8 space-y-6 flex flex-col justify-between">
          {/* Top Section */}
          <div className="space-y-4">
            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 rounded-full p-3 flex-shrink-0 shadow-lg">
                  <span className="h-5 w-5 text-orange-600">⭐</span>
                </div>
                <span className="text-gray-700 font-semibold">Professional-grade flight simulator</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 rounded-full p-3 flex-shrink-0 shadow-lg">
                  <span className="h-5 w-5 text-orange-600">🏆</span>
                </div>
                <span className="text-gray-700 font-semibold">Join our Fly to Win campaign</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 rounded-full p-3 flex-shrink-0 shadow-lg">
                  <span className="h-5 w-5 text-orange-600">🎁</span>
                </div>
                <span className="text-gray-700 font-semibold">Win amazing prizes & rewards</span>
              </div>
            </div>

            {/* Special Offer */}
            <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-5 border-2 border-orange-300 shadow-lg">
              <div className="text-center">
                <div className="text-orange-600 font-bold text-xl">🎉 Special Fly to Win Offer</div>
                <div className="text-gray-700 font-semibold text-sm mt-2">
                  Fly for 2.5 hours and get eligible for an official DGCA Certificate.
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - CTA Buttons */}
          <div className="space-y-4">
            <button 
              onClick={() => handleRedirect('/download')} // Redirect to /download when clicked
              className="w-full bg-gradient-to-r from-orange-600 to-red-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Start Flying Now
            </button>
            <button 
              onClick={() => handleRedirect('/features')} // Redirect to /features when clicked
              className="w-full border-2 border-gray-300 text-gray-600 py-4 px-6 rounded-2xl font-semibold text-lg hover:border-orange-400 hover:text-orange-600 transition-all"
            >
              Explore Features
            </button>
            
            {/* Bottom Note */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500">
                Join 50,000+ pilots worldwide • 4.9★ rating
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
