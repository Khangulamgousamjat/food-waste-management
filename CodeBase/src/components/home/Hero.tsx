import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-blue-50 -z-10"></div>
      
      {/* Animated blobs */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary-100 opacity-50 -z-10 blur-3xl"
        animate={{ 
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 15,
          ease: "easeInOut" 
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full bg-accent-100 opacity-50 -z-10 blur-3xl"
        animate={{ 
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 18,
          ease: "easeInOut" 
        }}
      />

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-primary-600">Reduce Waste,</span> <br />
              <span className="text-gray-800">Feed the Hungry</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join our community platform connecting food donors with those in need. Together, we can reduce waste and fight hunger in your local community.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/auth/signup" className="btn-primary w-full sm:w-auto">
                Get Started
              </Link>
              <Link to="/how-it-works" className="btn-outline w-full sm:w-auto group">
                <span>Learn More</span>
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:ml-auto"
          >
            <img 
              src="https://i.pinimg.com/736x/76/57/4a/76574a55771e9930e90d6f04d2ec8337.jpg"
              alt="People sharing food and reducing waste" 
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 md:mt-24"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <p className="text-4xl font-bold text-primary-600 mb-2">1.3B</p>
            <p className="text-gray-600">Tons of food wasted annually worldwide</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <p className="text-4xl font-bold text-primary-600 mb-2">10,000+</p>
            <p className="text-gray-600">Meals shared through our platform</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <p className="text-4xl font-bold text-primary-600 mb-2">950+</p>
            <p className="text-gray-600">Active community members</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;