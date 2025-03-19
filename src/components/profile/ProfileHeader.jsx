import React, { useEffect, useState } from 'react';
import { User, Edit2, LogOut } from 'lucide-react';

const ProfileHeader = ({ user, onEditProfile, onLogout }) => {
  const [profile, setProfile] = useState({
    username: user?.username || '',
    bio: '',
    avatar: null
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${import.meta.env.VITE_API_BASE_URL}/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile({
          username: data.username || '',
          bio: data.bio || '',
          avatar: data.avatar || null
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const timeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl rounded-xl p-6 mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/15 transform hover:scale-[1.01] transition-all duration-300">
      {/* Background decorative elements */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-40/20 to-pink-40/20 pointer-events-none" />
      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-white/10 to-white/12 blur-sm pointer-events-none" />
      
      <div className="relative flex items-center gap-4">
        {/* Profile Image */}
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 opacity-75 blur group-hover:opacity-100 transition duration-300" />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/10 border border-white/30 flex items-center justify-center overflow-hidden">
            {profile.avatar ? (
              <img 
                src={profile.avatar}
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-white/90 group-hover:scale-110 transition-transform duration-300" />
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <h2 className="text-lg font-light text-white/90">
            {timeOfDay()}, <span className="font-bold bg-gradient-to-r from-white via-purple-100 to-purple-200 text-transparent bg-clip-text">{profile.username}</span>
          </h2>
          {profile.bio && (
            <p className="text-sm text-white/70 mt-1 line-clamp-2">{profile.bio}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEditProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 transition-all duration-200 text-sm font-medium text-white group"
          >
            <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Edit</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 transition-all duration-200 text-sm font-medium text-white group"
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;