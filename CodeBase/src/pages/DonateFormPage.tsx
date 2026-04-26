import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addFoodListing } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Calendar, 
  Package, 
  Clock, 
  MapPin, 
  AlertCircle,
  Tag,
  FileText,
  Home,
  Check
} from 'lucide-react';

const DonateFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    food_type: '',
    expiration: '',
    pickup_location: profile?.address || '',
    pickup_instructions: '',
    pickup_times: '',
    image: null as File | null,
    urgency: 'medium',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const foodTypes = [
    'Bakery',
    'Dairy',
    'Fruits',
    'Vegetables',
    'Prepared Meals',
    'Canned Goods',
    'Dry Goods',
    'Beverages',
    'Frozen Food',
    'Other'
  ];
  
  const urgencyLevels = [
    { value: 'low', label: 'Low - Can wait a few days', color: 'success' },
    { value: 'medium', label: 'Medium - Best if taken within 1-2 days', color: 'warning' },
    { value: 'high', label: 'High - Needs to be taken today', color: 'error' }
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user corrects the field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
      
      // Clear error when user corrects the field
      if (errors.image) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Quantity is required';
    }
    
    if (!formData.food_type) {
      newErrors.food_type = 'Food type is required';
    }
    
    if (!formData.expiration) {
      newErrors.expiration = 'Expiration date is required';
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (formData.expiration < today) {
        newErrors.expiration = 'Expiration date cannot be in the past';
      }
    }
    
    if (!formData.pickup_location.trim()) {
      newErrors.pickup_location = 'Pickup location is required';
    }
    
    if (!formData.pickup_times.trim()) {
      newErrors.pickup_times = 'Pickup times are required';
    }
    
    // Image is optional, but if provided, it should be valid
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would upload the image to storage and get the URL
      // For now, just create the listing without an image
      const listingData = {
        name: formData.name,
        description: formData.description,
        quantity: formData.quantity,
        food_type: formData.food_type,
        expiration: formData.expiration,
        pickup_location: formData.pickup_location,
        pickup_instructions: formData.pickup_instructions,
        pickup_times: formData.pickup_times,
        image_url: null, // Would be the uploaded image URL
        urgency: formData.urgency,
        donor_id: user?.id,
        donor_name: profile?.organization || profile?.full_name || user?.email,
        status: 'available',
      };
      
      // In a real app, this would call the Supabase function
      // const { data, error } = await addFoodListing(listingData);
      
      // if (error) throw error;
      
      // Simulate success
      setTimeout(() => {
        toast.success('Food listing created successfully!');
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create listing. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-custom max-w-4xl">
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Donate Food</h1>
          <p className="text-lg text-gray-600">
            Share your surplus food with those who need it. Fill out the details below.
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Package className="mr-2 h-5 w-5 text-primary-500" />
                Food Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Food Name*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className={`pl-10 input-field ${errors.name ? 'border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="e.g., Fresh Bread, Organic Vegetables"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-error-600">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="food_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Food Type*
                  </label>
                  <select
                    id="food_type"
                    name="food_type"
                    value={formData.food_type}
                    onChange={handleChange}
                    className={`input-field ${errors.food_type ? 'border-error-500 focus:ring-error-500' : ''}`}
                  >
                    <option value="">Select a food type</option>
                    {foodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.food_type && (
                    <p className="mt-1 text-sm text-error-600">{errors.food_type}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="quantity"
                      name="quantity"
                      type="text"
                      value={formData.quantity}
                      onChange={handleChange}
                      className={`pl-10 input-field ${errors.quantity ? 'border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="e.g., 5 loaves, 3 kg, 2 boxes"
                    />
                  </div>
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-error-600">{errors.quantity}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="expiration" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="expiration"
                      name="expiration"
                      type="date"
                      value={formData.expiration}
                      onChange={handleChange}
                      className={`pl-10 input-field ${errors.expiration ? 'border-error-500 focus:ring-error-500' : ''}`}
                    />
                  </div>
                  {errors.expiration && (
                    <p className="mt-1 text-sm text-error-600">{errors.expiration}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description*
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className={`pl-10 input-field ${errors.description ? 'border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="Describe the food, its condition, and any other relevant details..."
                    ></textarea>
                  </div>
                  {errors.description && (
                    <p className="mt-1 text-sm text-error-600">{errors.description}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urgency Level*
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {urgencyLevels.map(level => (
                      <div
                        key={level.value}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                          formData.urgency === level.value 
                            ? `border-${level.color}-500 bg-${level.color}-50` 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, urgency: level.value as any }))}
                      >
                        <div className="flex items-center">
                          <div className={`h-4 w-4 rounded-full bg-${level.color}-500 mr-2`}></div>
                          <div>
                            <p className="font-medium">{level.label.split(' - ')[0]}</p>
                            <p className="text-xs text-gray-500">{level.label.split(' - ')[1]}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Food Image (Optional)
                  </label>
                  <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {previewImage ? (
                      <div>
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="mx-auto h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(null);
                            setFormData(prev => ({ ...prev, image: null }));
                          }}
                          className="mt-3 text-sm text-error-600 hover:text-error-700"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-3 flex flex-col sm:flex-row justify-center">
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500"
                          >
                            <span>Upload an image</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="text-xs text-gray-500 mt-1 sm:mt-0 sm:ml-2">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.image && (
                    <p className="mt-1 text-sm text-error-600">{errors.image}</p>
                  )}
                </div>
              </div>
              
              <div className="border-t border-gray-200 my-8"></div>
              
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-primary-500" />
                Pickup Details
              </h2>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="pickup_location" className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Location*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Home className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="pickup_location"
                      name="pickup_location"
                      type="text"
                      value={formData.pickup_location}
                      onChange={handleChange}
                      className={`pl-10 input-field ${errors.pickup_location ? 'border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="Full address for pickup"
                    />
                  </div>
                  {errors.pickup_location && (
                    <p className="mt-1 text-sm text-error-600">{errors.pickup_location}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="pickup_times" className="block text-sm font-medium text-gray-700 mb-1">
                    Available Pickup Times*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="pickup_times"
                      name="pickup_times"
                      type="text"
                      value={formData.pickup_times}
                      onChange={handleChange}
                      className={`pl-10 input-field ${errors.pickup_times ? 'border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="e.g., Weekdays 5-7 PM, Saturday 10 AM-2 PM"
                    />
                  </div>
                  {errors.pickup_times && (
                    <p className="mt-1 text-sm text-error-600">{errors.pickup_times}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="pickup_instructions" className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Instructions (Optional)
                  </label>
                  <textarea
                    id="pickup_instructions"
                    name="pickup_instructions"
                    rows={3}
                    value={formData.pickup_instructions}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Any special instructions for pickup, parking details, etc."
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn-outline py-3 px-6"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary py-3 px-8 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Listing...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Create Listing
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default DonateFormPage;