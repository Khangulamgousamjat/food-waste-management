import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Leaf, Users, Home } from 'lucide-react';

interface ImpactStatProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  delay: number;
}

const ImpactStat: React.FC<ImpactStatProps> = ({ icon, value, label, delay }) => {
  return (
    <motion.div 
      className="text-center p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">{value}</h3>
      <p className="text-gray-600">{label}</p>
    </motion.div>
  );
};

const ImpactStats: React.FC = () => {
  const stats = [
    {
      icon: <Apple className="w-12 h-12 text-primary-500" />,
      value: "25,380",
      label: "Meals Shared",
      delay: 0.1
    },
    {
      icon: <Leaf className="w-12 h-12 text-primary-500" />,
      value: "18.7",
      label: "Tons of CO₂ Saved",
      delay: 0.2
    },
    {
      icon: <Users className="w-12 h-12 text-primary-500" />,
      value: "4,820",
      label: "Active Members",
      delay: 0.3
    },
    {
      icon: <Home className="w-12 h-12 text-primary-500" />,
      value: "142",
      label: "Local Communities",
      delay: 0.4
    }
  ];

  return (
    <section className="py-16 bg-accent-50">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Collective Impact</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Together we're making a measurable difference in reducing food waste and fighting hunger.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <ImpactStat 
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              delay={stat.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;