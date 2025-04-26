"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, ShoppingBag, Shield, LogOut, ArrowLeft, Save, Edit, X, Camera } from 'lucide-react';

import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    state: '',
    city: '',
    country: '',
    pincode: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user !== null) {
      setIsLoading(false);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        contact: user.contact || '',
        address: user.address || '',
        state: user.state || '',
        city: user.city || '',
        country: user.country || '',
        pincode: user.pincode?.toString() || ''
      });
      if (user.pfp) {
        setImagePreview(user.pfp);
      }
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (formData.contact && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.contact)) {
      errors.contact = 'Invalid phone number';
    }
    
    if (formData.pincode && !/^\d+$/.test(formData.pincode)) {
      errors.pincode = 'ZIP code must be numeric';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError('Please correct the errors in the form');
      return;
    }
    
    setIsUpdating(true);

    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      
      if (!userData?._id) {
        throw new Error('User ID not found');
      }

      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      if (formData.contact) formDataToSend.append('contact', formData.contact);
      if (formData.address) formDataToSend.append('address', formData.address);
      if (formData.state) formDataToSend.append('state', formData.state);
      if (formData.city) formDataToSend.append('city', formData.city);
      if (formData.country) formDataToSend.append('country', formData.country);
      if (formData.pincode) formDataToSend.append('pincode', formData.pincode);
      
      if (imageFile) {
        formDataToSend.append('pfp', imageFile);
      }

      const res = await fetch(`https://api.agiigo.com/api/userprofile/${userData._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const responseData = await res.json();

      const updatedUser = {
        ...userData,
        ...responseData,
        pfp: responseData.pfp || userData.pfp
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setImagePreview(responseData.pfp || userData.pfp || null);
      setFormData({
        name: responseData.name || '',
        email: responseData.email || '',
        contact: responseData.contact || '',
        address: responseData.address || '',
        state: responseData.state || '',
        city: responseData.city || '',
        country: responseData.country || '',
        pincode: responseData.pincode?.toString() || ''
      });
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setImageFile(null);
    } catch (error) {
      console.error('Update error:', error);
      setError(error.message || 'An error occurred while updating profile');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button 
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-orange-500"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>Back</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">My Account</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center border-2 border-white shadow-md">
                        <User className="h-10 w-10 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h2 className="font-semibold">{user.name}</h2>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium ${activeTab === 'profile' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium ${activeTab === 'security' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Shield className="h-5 w-5" />
                  <span>Security</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Panel */}
          <div className="flex-1">
            {console.log(user)}
            {/* Profile Tab */}
            {activeTab === 'profile' && user && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Personal Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-1 text-orange-500 hover:text-orange-600"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setImageFile(null);
                        setImagePreview(user.pfp || null);
                      }}
                      className="flex items-center space-x-1 text-gray-500 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mx-6 mt-4 p-3 bg-green-50 text-green-600 rounded-md text-sm">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="p-6">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4 group">
                      <img 
                        src={imagePreview || user.pfp} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                      />
                      {isEditing && (
                        <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {isEditing && (
                      <div className="w-full max-w-xs">
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                          Change Profile Photo
                        </label>
                        <div className="flex items-center justify-center gap-2">
                          <label className="cursor-pointer">
                            <span className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm">
                              Upload Photo
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                          {imagePreview && imagePreview !== user.pfp && (
                            <button
                              type="button"
                              onClick={() => {
                                setImageFile(null);
                                setImagePreview(user.pfp || null);
                              }}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500 text-center">
                          JPG, GIF or PNG. Max size 2MB
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* View Mode (non-editing) */}
                    {!isEditing ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <p className="px-3 py-2 bg-gray-50 rounded-md">{user.name || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <p className="px-3 py-2 bg-gray-50 rounded-md">{user.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <p className="px-3 py-2 bg-gray-50 rounded-md">{user.contact || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                          <p className="px-3 py-2 bg-gray-50 rounded-md">{user.address || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <p className="px-3 py-2 bg-gray-50 rounded-md">{user.city || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                          <p className="px-3 py-2 bg-gray-50 rounded-md">{user.state || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <p className="px-3 py-2 bg-gray-50 rounded-md">{user.country || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                          <p className="px-3 py-2 bg-gray-50 rounded-md">{user.pincode || 'Not provided'}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Edit Mode (form inputs) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <input
                            type="tel"
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="+91 9876543210"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {isEditing && (
                    <div className="mt-8 flex justify-end">
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className={`px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center space-x-2 ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isUpdating ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">Security</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-md font-medium mb-3">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div className="pt-2">
                          <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                            Update Password
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}