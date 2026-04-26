import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Upload, MapPin, Clock, Scale, Tag } from "lucide-react";
import { toast } from "react-hot-toast";

interface DonationFormData {
  foodName: string;
  quantity: string;
  expiryDate: string;
  foodType: string;
  description: string;
  image: File | null;
  location: {
    latitude: number;
    longitude: number;
  };
}

const DonatePage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<DonationFormData>({
    foodName: "",
    quantity: "",
    expiryDate: "",
    foodType: "",
    description: "",
    image: null,
    location: {
      latitude: 0,
      longitude: 0,
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          }));
          toast.success("Location captured successfully!");
        },
        (error) => {
          toast.error(
            "Error getting location. Please enable location services."
          );
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would implement the actual donation submission logic
      // Including image upload and database storage

      toast.success("Donation submitted successfully!");
      // Reset form
      setFormData({
        foodName: "",
        quantity: "",
        expiryDate: "",
        foodType: "",
        description: "",
        image: null,
        location: {
          latitude: 0,
          longitude: 0,
        },
      });
    } catch (error) {
      toast.error("Failed to submit donation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Please log in to donate
          </h1>
          <p className="text-gray-600">
            You need to be logged in to make a donation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Donate Food
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Food Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Food Name
                  </label>
                  <input
                    type="text"
                    name="foodName"
                    value={formData.foodName}
                    onChange={handleChange}
                    className="input-field"
                    required
                    placeholder="Enter food name"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Scale className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="pl-10 input-field"
                      required
                      placeholder="e.g., 2 kg, 5 servings"
                    />
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className="pl-10 input-field"
                      required
                    />
                  </div>
                </div>

                {/* Food Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Food Type
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="foodType"
                      value={formData.foodType}
                      onChange={handleChange}
                      className="pl-10 input-field"
                      required
                    >
                      <option value="">Select food type</option>
                      <option value="cooked">Cooked Food</option>
                      <option value="packaged">Packaged Food</option>
                      <option value="fresh">Fresh Produce</option>
                      <option value="canned">Canned Food</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field"
                    rows={3}
                    placeholder="Describe the food item, storage conditions, etc."
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG up to 10MB
                      </p>
                      {formData.image && (
                        <p className="text-sm text-primary-600">
                          Selected file: {formData.image.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Get Current Location
                  </button>
                  {formData.location.latitude !== 0 && (
                    <p className="mt-2 text-sm text-gray-600">
                      Location captured: {formData.location.latitude.toFixed(6)}
                      , {formData.location.longitude.toFixed(6)}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary py-3 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Donation"
                  )}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DonatePage;
