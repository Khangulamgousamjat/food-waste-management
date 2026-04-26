import React from 'react';
import { motion } from 'framer-motion';
import { Package, Map, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Package className="w-12 h-12 text-primary-600" />,
      title: "List Food or Search Listings",
      description: "Donors can list available food, while recipients can search for what they need based on location and preferences.",
      delay: 0.1
    },
    {
      icon: <Map className="w-12 h-12 text-primary-600" />,
      title: "Connect & Arrange Pickup",
      description: "Use our platform to communicate and arrange convenient pickup or delivery times and locations.",
      delay: 0.3
    },
    {
      icon: <Clock className="w-12 h-12 text-primary-600" />,
      title: "Complete the Exchange",
      description: "Meet up, exchange the food, and confirm the transaction. Both parties earn impact points and badges.",
      delay: 0.5
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
          <p className="text-xl text-gray-600">
            Our easy 3-step process connects food donors with recipients, making food sharing simple and efficient.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: step.delay }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="bg-primary-50 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2">
                  <ChevronRight className="w-8 h-8 text-primary-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Link to="/how-it-works" className="btn-primary inline-flex items-center">
            Learn More About The Process
            <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;