import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const location = useLocation();
  const navigate = useNavigate();
  const resetToken = location.state?.resetToken;

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showNotification('Passwords do not match!', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword,
          token: resetToken
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      showNotification('Password reset successfully!', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      showNotification('Failed to reset password. Please try again.', 'error');
    }
  };

  if (!resetToken) {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <div className="text-white text-xl">Invalid reset token. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="relative">
        {notification.message && (
          <div className={`absolute -top-16 left-1/2 transform -translate-x-1/2 w-80 px-6 py-3 rounded-lg text-white text-center font-medium shadow-lg animate-pulse ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {notification.message}
          </div>
        )}
        <div className="bg-[#000000]/20 backdrop-blur-md shadow-lg shadow-[#9D5CFF]/50 rounded-3xl p-8 w-full max-w-md border border-white/30">
          <h2 className="text-white text-2xl font-semibold text-center mb-6">Reset Password</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full px-4 py-3 rounded-xl bg-white/90 shadow-md backdrop-blur-md border-none focus:ring-2 focus:ring-[#9D5CFF] outline-none text-gray-800 placeholder-gray-500 transition"
              required
              minLength={6}
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="w-full px-4 py-3 rounded-xl bg-white/90 shadow-md backdrop-blur-md border-none focus:ring-2 focus:ring-[#9D5CFF] outline-none text-gray-800 placeholder-gray-500 transition"
              required
              minLength={6}
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#004AAD] to-[#002F6C] text-white py-3 rounded-xl font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;