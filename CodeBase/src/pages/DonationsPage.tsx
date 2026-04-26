import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { MapPin, Clock, Scale, Tag, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";

interface Donation {
  id: string;
  foodName: string;
  quantity: string;
  expiryDate: string;
  foodType: string;
  description: string;
  imageUrl: string;
  location: {
    latitude: number;
    longitude: number;
  };
  donor: {
    name: string;
    rating: number;
  };
  status: "available" | "reserved" | "claimed";
  createdAt: string;
}

const DonationsPage: React.FC = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([
    {
      id: "1",
      foodName: "Fresh Vegetables",
      quantity: "5 kg",
      expiryDate: "2024-05-10",
      foodType: "fresh",
      description:
        "Assorted fresh vegetables including tomatoes, potatoes, and onions",
      imageUrl: "https://example.com/vegetables.jpg",
      location: {
        latitude: 12.9716,
        longitude: 77.5946,
      },
      donor: {
        name: "John's Restaurant",
        rating: 4.5,
      },
      status: "available",
      createdAt: "2024-05-06T10:00:00Z",
    },
    // Add more mock donations as needed
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );

  const handleClaimDonation = async (donationId: string) => {
    setIsLoading(true);
    try {
      // Here you would implement the actual claim logic
      toast.success("Donation claimed successfully!");
      setDonations((prev) =>
        prev.map((d) => (d.id === donationId ? { ...d, status: "claimed" } : d))
      );
    } catch (error) {
      toast.error("Failed to claim donation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Please log in to view donations
          </h1>
          <p className="text-gray-600">
            You need to be logged in to see available food donations.
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
          className="max-w-6xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Available Donations
            </h1>
            <p className="text-gray-600 mt-2">
              Browse and claim available food donations in your area
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {donation.imageUrl && (
                    <img
                      src={donation.imageUrl}
                      alt={donation.foodName}
                      className="object-cover w-full h-48"
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {donation.foodName}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        donation.status === "available"
                          ? "bg-green-100 text-green-800"
                          : donation.status === "reserved"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {donation.status.charAt(0).toUpperCase() +
                        donation.status.slice(1)}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Scale className="h-5 w-5 mr-2" />
                      <span>{donation.quantity}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>
                        Expires:{" "}
                        {new Date(donation.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Tag className="h-5 w-5 mr-2" />
                      <span className="capitalize">{donation.foodType}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>2.5 km away</span>
                    </div>
                  </div>

                  <p className="mt-4 text-gray-600 text-sm">
                    {donation.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">
                          {donation.donor.name}
                        </span>
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{donation.donor.rating}</span>
                        </div>
                      </div>
                    </div>
                    {donation.status === "available" && (
                      <button
                        onClick={() => handleClaimDonation(donation.id)}
                        disabled={isLoading}
                        className="btn-primary px-4 py-2 text-sm"
                      >
                        {isLoading ? "Claiming..." : "Claim Donation"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DonationsPage;
