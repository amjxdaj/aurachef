import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  
  const [profile, setProfile] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: '',
    avatar: null
  });

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
      return;
    }

    if (user) {
      setProfile(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || ''
      }));
      
      fetchUserProfile();
    }
  }, [user, loading, navigate]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(prev => ({
          ...prev,
          username: data.username || prev.username,
          email: data.email || prev.email,
          bio: data.bio || '',
          avatar: data.avatar || null
        }));
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(prev => ({ ...prev, avatar: file }));
    }
  };

  const resetForm = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    fetchUserProfile();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Append all profile data to FormData
      formData.append('username', profile.username);
      formData.append('bio', profile.bio || '');
      
      // Only append avatar if it's a File object (new upload)
      if (profile.avatar instanceof File) {
        formData.append('avatar', profile.avatar);
      }

      const response = await fetch('http://localhost:5001/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setProfile(prev => ({
          ...prev,
          username: updatedUser.username,
          bio: updatedUser.bio,
          avatar: updatedUser.avatar
        }));
        navigate('/profile');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen  pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-8 [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">
          Edit Profile
        </h1>

        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_16px_rgb(0_0_0_/_25%)] transform perspective-1000">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 mb-4 rounded-2xl overflow-hidden transform perspective-1000 transition-transform hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/50"></div>
                  {profile.avatar ? (
                    <img 
                      src={profile.avatar instanceof File ? URL.createObjectURL(profile.avatar) : profile.avatar}
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                      <User className="w-20 h-20 text-white/70" />
                    </div>
                  )}
                </div>
                
                <label className="relative group cursor-pointer">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <div className="btn bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transform transition-all duration-200 hover:translate-y-[-2px] hover:shadow-xl active:translate-y-0">
                    <Upload className="w-5 h-5" />
                    <span>Upload Photo</span>
                  </div>
                </label>
              </div>
              
              <div className="flex-1 space-y-6">
                <div>
                  <label htmlFor="username" className="block text-white font-medium mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={profile.username}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/20 px-4 py-3 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    readOnly
                    className="w-full bg-white/10 border border-white/20 px-4 py-3 rounded-xl text-white/70 cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-white font-medium mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-white/5 border border-white/20 px-4 py-3 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-6 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all duration-200 transform hover:translate-y-[-2px] active:translate-y-0"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 shadow-lg transform transition-all duration-200 hover:translate-y-[-2px] hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;