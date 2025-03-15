import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Upload, X } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const [profile, setProfile] = useState(user);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(prev => ({ ...prev, profileImage: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfile(prev => ({ ...prev, profileImage: null }));
    setPreviewUrl(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile updated:', profile);
    // In a real app, this would update the database
    navigate('/profile');
  };

  if (!user) return null; // Prevents rendering if user is null
  
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="page-transition max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-shadow text-center mb-8">
          Edit Profile
        </h1>
        
        <div className="glass p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Profile Preview" 
                      className="w-full h-full object-cover rounded-full border-2 border-white/50"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                  
                  {previewUrl && (
                    <button 
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-white/20 p-1 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
                
                <label className="cursor-pointer btn btn-primary px-4 py-2 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              
              <div className="flex-1 space-y-4">
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
                    className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
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
                    onChange={handleChange}
                    className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    required
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
                    className="w-full glass bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="btn btn-secondary px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-3d px-6"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;