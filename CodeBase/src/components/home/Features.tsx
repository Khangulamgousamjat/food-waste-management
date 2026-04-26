import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, BarChart, Award, Brain, Clock } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, delay }) => {
  return (
    <motion.div 
      className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="bg-primary-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-primary-600" />,
      title: "AI-Powered Food Matching",
      description: "Our smart system suggests matches between donors and recipients based on food types, distance, and scheduling compatibility.",
      delay: 0.1
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary-600" />,
      title: "Real-Time Geolocation",
      description: "Find nearby food donations or recipients with our interactive map, making the exchange process quick and efficient.",
      delay: 0.2
    },
    {
      icon: <BarChart className="w-8 h-8 text-primary-600" />,
      title: "Impact Analytics",
      description: "Track your environmental impact with personalized data on CO₂ emissions saved, meals provided, and overall contribution.",
      delay: 0.3
    },
    {
      icon: <Award className="w-8 h-8 text-primary-600" />,
      title: "Gamification Rewards",
      description: "Earn badges, points, and climb the leaderboards as you participate in reducing food waste in your community.",
      delay: 0.4
    },
    {
      icon: <Clock className="w-8 h-8 text-primary-600" />,
      title: "Last-Minute Rescue",
      description: "Special alerts for food that needs to be rescued quickly, helping prevent immediate waste and feeding those in need.",
      delay: 0.5
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Powerful Features to Reduce Food Waste</h2>
          <p className="text-xl text-gray-600">
            Our platform comes equipped with everything you need to efficiently share surplus food and make a positive impact.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;