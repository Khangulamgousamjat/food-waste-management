import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  Search, 
  MapPin, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  BarChart, 
  Award,
  ArrowRight
} from 'lucide-react';

const HowItWorksPage: React.FC = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };
  
  const donorSteps = [
    {
      icon: <Package className="h-8 w-8 text-primary-500" />,
      title: "List Your Surplus Food",
      description: "Take a photo, add details about quantity, expiration, and pickup preferences. It takes just a minute to create a listing."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary-500" />,
      title: "Connect with Recipients",
      description: "Receive notifications when someone requests your food. Our platform makes communication safe and easy."
    },
    {
      icon: <Clock className="h-8 w-8 text-primary-500" />,
      title: "Arrange the Handoff",
      description: "Confirm pickup details directly through our platform. Choose a time and location that works for both parties."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary-500" />,
      title: "Complete the Exchange",
      description: "Meet the recipient and hand off the food. Confirm the exchange in the app to earn impact points."
    }
  ];
  
  const recipientSteps = [
    {
      icon: <Search className="h-8 w-8 text-secondary-500" />,
      title: "Find Available Food",
      description: "Browse listings in your area or set up alerts for specific food types. Our map makes it easy to find what's nearby."
    },
    {
      icon: <MapPin className="h-8 w-8 text-secondary-500" />,
      title: "Request What You Need",
      description: "When you find something you need, send a request to the donor explaining why you're interested in their food."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-secondary-500" />,
      title: "Coordinate Pickup",
      description: "Once your request is approved, communicate with the donor to arrange a convenient pickup time and location."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-secondary-500" />,
      title: "Receive the Food",
      description: "Meet the donor, receive the food, and confirm the exchange in the app. Share your experience to help build trust."
    }
  ];
  
  const benefits = [
    {
      icon: <Package className="h-10 w-10 text-primary-500" />,
      title: "Reduce Food Waste",
      description: "Stop throwing away good food. By sharing surplus, we collectively reduce the environmental impact of food waste."
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary-500" />,
      title: "Track Your Impact",
      description: "See exactly how much CO₂ you've saved and how many meals you've contributed through our detailed impact analytics."
    },
    {
      icon: <Award className="h-10 w-10 text-primary-500" />,
      title: "Earn Recognition",
      description: "Gain points, badges, and climb our leaderboards as you make a difference in your community."
    }
  ];
  
  const faqs = [
    {
      question: "Is it safe to share food?",
      answer: "Yes, when done properly. Our platform includes guidelines on safe food handling and storage. We recommend only sharing food that has been properly stored and is still within its safe consumption period."
    },
    {
      question: "Are there any costs involved?",
      answer: "FoodShare is completely free to use. Donors can give away their surplus food at no cost, and recipients can receive food without any fees. We're committed to making food sharing accessible to everyone."
    },
    {
      question: "How does verification work?",
      answer: "Users verify their identities through email verification and optional phone verification. For organizations, we offer additional verification steps to build trust in the community."
    },
    {
      question: "What types of food can be shared?",
      answer: "Almost any type of food can be shared, from fresh produce to packaged goods, as long as it's still safe to consume. We provide guidelines for each food category to ensure safety."
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="bg-primary-50 py-16">
        <div className="container-custom">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-6 text-gray-800">How FoodShare Works</h1>
            <p className="text-xl text-gray-600 mb-8">
              Our platform makes it easy to reduce food waste and fight hunger in your community.
              Learn how to get started as a food donor or recipient.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/signup" className="btn-primary">
                Join as a Donor
              </Link>
              <Link to="/auth/signup" className="btn-outline">
                Join as a Recipient
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Process Section - For Donors */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            {...fadeIn}
          >
            <h2 className="text-3xl font-bold mb-4">For Food Donors</h2>
            <p className="text-xl text-gray-600">
              Turn your surplus food into impact. Whether you're a restaurant, grocery store, or individual, 
              here's how to share your extra food.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {donorSteps.map((step, index) => (
              <motion.div 
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col">
                  <div className="mb-4 bg-primary-50 p-4 rounded-full w-16 h-16 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  
                  {index < donorSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="h-6 w-6 text-primary-300" />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center mt-4 lg:hidden">
                  {index < donorSteps.length - 1 && (
                    <ArrowRight className="h-6 w-6 text-primary-300 transform rotate-90" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/auth/signup" 
              className="btn-primary"
            >
              Get Started as a Donor
            </Link>
          </div>
        </div>
      </section>
      
      {/* Process Section - For Recipients */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            {...fadeIn}
          >
            <h2 className="text-3xl font-bold mb-4">For Food Recipients</h2>
            <p className="text-xl text-gray-600">
              Find available food in your community. Whether you're an individual or organization serving those in need,
              here's how to receive food.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recipientSteps.map((step, index) => (
              <motion.div 
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col">
                  <div className="mb-4 bg-secondary-50 p-4 rounded-full w-16 h-16 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  
                  {index < recipientSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="h-6 w-6 text-secondary-300" />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center mt-4 lg:hidden">
                  {index < recipientSteps.length - 1 && (
                    <ArrowRight className="h-6 w-6 text-secondary-300 transform rotate-90" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/auth/signup" 
              className="btn-secondary"
            >
              Get Started as a Recipient
            </Link>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            {...fadeIn}
          >
            <h2 className="text-3xl font-bold mb-4">Why Use FoodShare?</h2>
            <p className="text-xl text-primary-100">
              Beyond connecting donors and recipients, our platform offers unique features to enhance your food sharing experience.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="bg-primary-700 p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-primary-100">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            {...fadeIn}
          >
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about food sharing with FoodShare.
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                className="mb-6 border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="text-lg text-gray-600 mb-6">
              Still have questions? We're here to help.
            </p>
            <Link 
              to="/contact" 
              className="btn-primary"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-accent-50">
        <div className="container-custom">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            {...fadeIn}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Reduce Food Waste?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join the FoodShare community today and start making a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/signup" className="btn-primary">
                Create an Account
              </Link>
              <Link to="/map" className="btn-outline">
                Explore Food Map
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;