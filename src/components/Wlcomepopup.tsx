import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const WelcomePopup = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => setIsVisible(false);

  const handleGetStarted = () => {
    navigate('/download'); // ⬅️ Adjust this as needed
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex bg-orange-100 rounded-3xl w-full max-w-4xl mx-auto overflow-hidden shadow-2xl"
      >
        {/* ❌ Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow"
        >
          <X className="h-5 w-5 text-gray-700" />
        </button>

        {/* 🖼 Left Section: Image */}
        <div className="w-1/2 bg-orange-500 flex items-center justify-center p-6">
          <img
            src= '/images/Student.png'
            alt="Fly to Win"
            className="object-contain max-h-[400px] rounded-xl"
          />
        </div>

        {/* 📄 Right Section: Text */}
        <div className="w-1/2 p-10 bg-white flex flex-col justify-center space-y-6">
          <h2 className="text-3xl font-bold text-orange-600 leading-tight">
            Get a Chance to Win<br />
            DGCA Certificate Worth ₹45,000!
          </h2>

          <p className="text-gray-700 text-base">
            Fly for just <strong>2 hours 30 minutes</strong> using our high-precision drone simulator and get eligible for an official <strong>DGCA Certificate</strong>.
          </p>

          <div className="bg-orange-50 border border-orange-300 rounded-lg p-4 shadow-sm text-gray-700 text-sm">
            • Realistic drone flight experience<br />
            • Fly-to-Win challenge access<br />
            • Earn official recognition
          </div>

          <button
            onClick={handleGetStarted}
            className="w-full bg-red-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-red-700 transition-all"
          >
            Get Started
          </button>

          <div className="text-right text-xs text-gray-500 pt-2">
            <a href="/flytowin" className="hover:underline">T&Cs apply</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
