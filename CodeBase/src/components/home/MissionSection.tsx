import React from 'react';
import { motion } from 'framer-motion';

const MissionSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Mission: <span className="text-primary-600">Ending Hunger</span>
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Every day, millions go to sleep hungry while tons of edible food are wasted. 
            We are here to bridge that gap.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image 1 with Info */}
          <motion.div 
            className="flex flex-col space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
              <img 
                src="/images/hunger-mission-1.png" 
                alt="Children waiting for food" 
                className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">The Reality of Hunger</h3>
                  <p className="text-gray-200">
                    Over 800 million people worldwide face chronic hunger. Many are children who deserve a healthy start in life.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image 2 with Info */}
          <motion.div 
            className="flex flex-col space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
              <img 
                src="/images/hunger-mission-2.png" 
                alt="Volunteer serving food" 
                className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Our Collective Impact</h3>
                  <p className="text-gray-200">
                    By connecting surplus food with those who need it most, we've helped serve thousands of meals to local communities.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Informational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <motion.div 
            className="bg-green-50 p-8 rounded-2xl border border-green-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-3xl mb-4">🌍</div>
            <h4 className="text-xl font-bold mb-2 text-green-900">Global Problem</h4>
            <p className="text-green-800">
              1/3 of all food produced is wasted while 1 in 9 people go hungry.
            </p>
          </motion.div>

          <motion.div 
            className="bg-blue-50 p-8 rounded-2xl border border-blue-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="text-3xl mb-4">🤝</div>
            <h4 className="text-xl font-bold mb-2 text-blue-900">Local Solution</h4>
            <p className="text-blue-800">
              We empower local donors to share surplus with nearby recipients instantly.
            </p>
          </motion.div>

          <motion.div 
            className="bg-orange-50 p-8 rounded-2xl border border-orange-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="text-3xl mb-4">✨</div>
            <h4 className="text-xl font-bold mb-2 text-orange-900">Your Action</h4>
            <p className="text-orange-800">
              Every donation, no matter how small, makes a real difference in someone's life.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
