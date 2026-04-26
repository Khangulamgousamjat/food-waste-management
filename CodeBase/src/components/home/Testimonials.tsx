import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  message: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Food Donor · Mumbai",
    message: "FoodShare has transformed how our restaurant handles surplus food. Instead of throwing it away at the end of the day, we now donate it to families nearby. It feels incredible to make such a direct impact."
  },
  {
    id: 2,
    name: "Rahul Mehta",
    role: "Food Recipient · Delhi",
    message: "As a single father of two, I sometimes struggle to put food on the table. FoodShare connected me with generous donors in my area. My children haven't gone to bed hungry since I joined this platform."
  },
  {
    id: 3,
    name: "Aisha Khan",
    role: "Community Volunteer · Bangalore",
    message: "I've been volunteering with food banks for years, but FoodShare makes the entire process so efficient. Real-time listings mean food reaches people before it expires. This is the future of food charity."
  },
  {
    id: 4,
    name: "Vikram Nair",
    role: "Food Donor · Hyderabad",
    message: "After our community event, we had enormous amounts of food left. FoodShare helped us find 5 nearby recipients within minutes. Every plate of food found a grateful family. Absolutely brilliant platform."
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">What Our Community Says</h2>
          <p className="text-xl text-gray-600">
            Hear from the donors and recipients who are making a difference every day.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-8 md:p-12 rounded-xl shadow-lg"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="mb-6 md:mb-0 flex-shrink-0">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-100 bg-primary-50 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary-500">{current.name[0]}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-primary-500 rounded-full p-2">
                    <Quote className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-gray-700 text-lg italic mb-6">"{current.message}"</p>
                <div>
                  <h4 className="text-xl font-semibold">{current.name}</h4>
                  <p className="text-gray-500 text-sm mt-1">{current.role}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex items-center space-x-2">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

