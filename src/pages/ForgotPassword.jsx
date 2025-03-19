import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://aurachef-backend.vercel.app/api/auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }

      showNotification('OTP sent successfully!', 'success');
      setShowOtpField(true);
    } catch (error) {
      showNotification('Failed to send OTP. Please try again.', 'error');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://aurachef-backend.vercel.app/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        throw new Error('Invalid OTP');
      }

      const data = await response.json();
      navigate('/reset-password', { state: { resetToken: data.resetToken } });
    } catch (error) {
      showNotification('Invalid OTP. Please try again.', 'error');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="relative">
        {notification.message && (
          <div className={`absolute -top-24 left-1/2 transform -translate-x-1/2 w-80 px-8 py-3 rounded-lg text-white text-center font-medium shadow-lg animate-pulse ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {notification.message}
          </div>
        )}
        <div className="bg-[#000000]/20 backdrop-blur-md shadow-lg shadow-[#9D5CFF]/50 rounded-3xl p-8 w-full max-w-md border border-white/30">
          <h2 className="text-white text-2xl font-semibold text-center mb-6">
            {showOtpField ? 'Enter OTP' : 'Reset Password'}
          </h2>
          
          {!showOtpField ? (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-white/90 shadow-md backdrop-blur-md border-none focus:ring-2 focus:ring-[#9D5CFF] outline-none text-gray-800 placeholder-gray-500 transition"
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#004AAD] to-[#002F6C] text-white py-3 rounded-xl font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg"
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full px-4 py-3 rounded-xl bg-white/90 shadow-md backdrop-blur-md border-none focus:ring-2 focus:ring-[#9D5CFF] outline-none text-gray-800 placeholder-gray-500 transition"
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#004AAD] to-[#002F6C] text-white py-3 rounded-xl font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg"
              >
                Verify OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;