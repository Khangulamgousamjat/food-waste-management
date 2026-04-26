import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://zfedbixtpqbltxmvppuq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmZWRiaXh0cHFibHR4bXZwcHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjU1OTcsImV4cCI6MjA2MjA0MTU5N30.xRIgM1oe_GScyc0VLdyJCMTgTKOdapurRllC5h1ZYPM');

interface Testimonial {
  id: number;
  name: string;
  email?: string;
  message: string;
  created_at?: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching testimonials:', error);
      } else {
        setTestimonials(data || []);
      }
    };

    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  if (testimonials.length === 0) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold">Testimonials</h2>
        <p className="mt-4">No testimonials yet.</p>
      </div>
    );
  }

  const current = testimonials[currentIndex];

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 md:p-12 rounded-xl shadow-lg"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="mb-6 md:mb-0">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-100 bg-gray-200 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-500">{current.name[0]}</span>
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
                  {current.email && <p className="text-gray-600">{current.email}</p>}
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
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full ${
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
