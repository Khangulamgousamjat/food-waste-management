import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CallToAction: React.FC = () => {
  return (
    <section className="py-20 bg-primary-600 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-white"></div>
        <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-white"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Ready to Make a Difference in Your Community?
          </motion.h2>
          
          <motion.p 
            className="text-xl text-primary-100 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Join thousands of others who are already reducing food waste and fighting hunger. 
            Whether you're a restaurant, grocery store, or individual, your contribution matters.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Link 
              to="/auth/signup" 
              className="btn bg-white text-primary-600 hover:bg-gray-100 focus:ring-white w-full sm:w-auto"
            >
              Join as a Donor
            </Link>
            <Link 
              to="/auth/signup" 
              className="btn bg-transparent border-2 border-white text-white hover:bg-primary-700 focus:ring-white w-full sm:w-auto"
            >
              Join as a Recipient
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;