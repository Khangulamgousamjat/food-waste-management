import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Building, 
  Camera, 
  Edit, 
  Save,
  Award,
  CheckCircle
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, profile: authProfile, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    organization: '',
    address: '',
    phone: '',
    bio: ''
  });
  
  useEffect(() => {
    if (authProfile) {
      setProfile(authProfile);
      setFormData({
        full_name: authProfile.full_name || '',
        username: authProfile.username || '',
        organization: authProfile.organization || '',
        address: authProfile.address || '',
        phone: authProfile.phone || '',
        bio: authProfile.bio || ''
      });
    }
  }, [authProfile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      // Simulate API call
      // In a real app, this would call the Supabase function
      // const { data, error } = await updateUserProfile(user.id, formData);
      
      // if (error) throw error;
      
      // Simulate success
      setTimeout(async () => {
        // Update local state
        setProfile({ ...profile, ...formData });
        
        // Exit edit mode
        setIsEditing(false);
        setIsSaving(false);
        
        // Refresh user data in auth context
        await refreshUser();
        
        toast.success('Profile updated successfully!');
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile. Please try again.');
      setIsSaving(false);
    }
  };
  
  // Example achievements data
  const achievements = [
    {
      id: 1,
      name: 'First Donation',
      description: 'Made your first food donation',
      icon: '🎁',
      completed: true,
      date: '2025-04-15'
    },
    {
      id: 2,
      name: 'Food Hero',
      description: 'Donated more than 10 times',
      icon: '🦸',
      completed: true,
      date: '2025-05-01'
    },
    {
      id: 3,
      name: 'Consistent Contributor',
      description: 'Donated for 4 consecutive weeks',
      icon: '📅',
      completed: true,
      date: '2025-05-10'
    },
    {
      id: 4,
      name: 'Waste Warrior',
      description: 'Saved 50kg of food from being wasted',
      icon: '🛡️',
      completed: false,
      progress: 32,
      goal: 50
    },
    {
      id: 5,
      name: 'Community Connector',
      description: 'Connected with 20 different recipients',
      icon: '🤝',
      completed: false,
      progress: 12,
      goal: 20
    }
  ];
  
  if (!profile) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-custom max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Column */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Profile Header */}
              <div className="bg-primary-600 p-8 relative">
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-white text-primary-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label={isEditing ? "Cancel editing" : "Edit profile"}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center text-white">
                  <div className="flex-shrink-0 mb-4 sm:mb-0">
                    <div className="relative">
                      <div className="w-24 h-24 bg-primary-300 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                        {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                      </div>
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 bg-white text-primary-600 p-1.5 rounded-full border-2 border-primary-600 hover:bg-gray-100 transition-colors">
                          <Camera className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:ml-6 text-center sm:text-left">
                    <h1 className="text-2xl font-bold">{profile.full_name || user?.email}</h1>
                    <p className="text-primary-100">
                      {profile.account_type === 'donor' ? 'Food Donor' : 'Food Recipient'}
                      {profile.organization && ` • ${profile.organization}`}
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center sm:justify-start items-center gap-3">
                      <span className="bg-primary-500 px-3 py-1 rounded-full text-sm font-medium">
                        Points: 1,250
                      </span>
                      <span className="bg-primary-500 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        3 Badges
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Profile Form/Content */}
              <div className="p-8">
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="full_name"
                            name="full_name"
                            type="text"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="pl-10 input-field"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            className="pl-10 input-field"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="phone"
                            name="phone"
                            type="text"
                            value={formData.phone}
                            onChange={handleChange}
                            className="pl-10 input-field"
                          />
                        </div>
                      </div>
                      
                      {profile.account_type === 'donor' && (
                        <div>
                          <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                            Organization Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Building className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="organization"
                              name="organization"
                              type="text"
                              value={formData.organization}
                              onChange={handleChange}
                              className="pl-10 input-field"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleChange}
                            className="pl-10 input-field"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows={4}
                          value={formData.bio}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Tell us a bit about yourself or your organization..."
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="btn-outline py-2 px-4 mr-3"
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary py-2 px-6 flex items-center"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p>{user?.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p>{profile.phone || 'Not provided'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p>{profile.address || 'Not provided'}</p>
                          </div>
                        </div>
                        
                        {profile.account_type === 'donor' && profile.organization && (
                          <div className="flex items-start">
                            <Building className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500">Organization</p>
                              <p>{profile.organization}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {profile.bio && (
                      <div>
                        <h2 className="text-lg font-semibold mb-2">About</h2>
                        <p className="text-gray-700">{profile.bio}</p>
                      </div>
                    )}
                    
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Impact Statistics</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-primary-50 p-4 rounded-lg">
                          <p className="text-lg font-bold text-primary-600">
                            {profile.account_type === 'donor' ? '38' : '27'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {profile.account_type === 'donor' ? 'Donations Made' : 'Items Received'}
                          </p>
                        </div>
                        
                        <div className="bg-accent-50 p-4 rounded-lg">
                          <p className="text-lg font-bold text-accent-600">
                            {profile.account_type === 'donor' ? '152' : '108'}
                          </p>
                          <p className="text-sm text-gray-600">Meals Equivalent</p>
                        </div>
                        
                        <div className="bg-success-50 p-4 rounded-lg">
                          <p className="text-lg font-bold text-success-600">76.4 kg</p>
                          <p className="text-sm text-gray-600">CO₂ Emissions Saved</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Achievements Column */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Award className="mr-2 h-5 w-5 text-primary-500" />
                Achievements
              </h2>
              
              <div className="space-y-4">
                {achievements.map(achievement => (
                  <div key={achievement.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{achievement.icon}</div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{achievement.name}</h3>
                          {achievement.completed && (
                            <CheckCircle className="ml-2 h-4 w-4 text-success-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                    
                    {achievement.completed ? (
                      <p className="text-xs text-gray-500 mt-2">
                        Completed on {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    ) : (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress: {achievement.progress}/{achievement.goal}</span>
                          <span>{Math.round((achievement.progress / achievement.goal) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full" 
                            style={{ width: `${(achievement.progress / achievement.goal) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <a href="/achievements" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View all achievements →
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;