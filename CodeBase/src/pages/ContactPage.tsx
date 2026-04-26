import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    purpose: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-primary-500" />,
      title: 'Email Us',
      details: 'support@foodshare.example.com',
      action: 'Send an email',
      link: 'mailto:support@foodshare.example.com'
    },
    {
      icon: <Phone className="h-6 w-6 text-primary-500" />,
      title: 'Call Us',
      details: '(555) 123-4567',
      action: 'Make a call',
      link: 'tel:+15551234567'
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary-500" />,
      title: 'Visit Us',
      details: '123 Green Street, New York, NY 10001',
      action: 'Get directions',
      link: 'https://maps.google.com/?q=123+Green+Street+New+York+NY+10001'
    }
  ];

  const faqs = [
    {
      question: 'How does FoodShare ensure food safety?',
      answer: 'We provide guidelines for proper food handling and storage. Donors are encouraged to share only food that is still safe to consume, and we provide clear expiration information on all listings.'
    },
    {
      question: 'Is there a cost to use FoodShare?',
      answer: 'No, FoodShare is completely free to use for both donors and recipients. Our mission is to reduce food waste and fight hunger, not to generate profit.'
    },
    {
      question: 'Can I donate as an individual or do I need to be a business?',
      answer: 'Both individuals and businesses can donate! We welcome food donations from restaurants, grocery stores, farms, and individuals with surplus food.'
    },
    {
      question: 'How are recipients verified?',
      answer: 'Recipients create verified accounts and build profile reputation through reviews. Organizations serving those in need can apply for verified status.'
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user corrects the field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    if (!formData.purpose) {
      newErrors.purpose = 'Please select a purpose';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Your message has been sent! We\'ll get back to you soon.');
      
      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        purpose: ''
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <section className="bg-primary-50 py-16">
        <div className="container-custom">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Contact Us</h1>
            <p className="text-xl text-gray-600">
              Have questions or feedback? We're here to help! Get in touch with our team.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="p-4 bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {info.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{info.title}</h3>
                <p className="text-gray-600 mb-4">{info.details}</p>
                <a 
                  href={info.link} 
                  className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                  target={info.icon === <MapPin className="h-6 w-6 text-primary-500" /> ? "_blank" : undefined}
                  rel="noopener noreferrer"
                >
                  {info.action}
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </a>
              </motion.div>
            ))}
          </div>
          
          {/* Contact Form and FAQs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <MessageSquare className="mr-2 h-6 w-6 text-primary-500" />
                Send Us a Message
              </h2>
              
              {isSubmitted ? (
                <div className="bg-success-50 p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-8 w-8 text-success-600 mr-3" />
                    <h3 className="text-xl font-semibold text-success-700">Message Sent!</h3>
                  </div>
                  <p className="text-success-600 mb-4">
                    Thank you for contacting us. We've received your message and will get back to you as soon as possible.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="btn-outline py-2 text-success-600 border-success-600 hover:bg-success-50"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className={`input-field ${errors.name ? 'border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-error-600">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input-field ${errors.email ? 'border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-error-600">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                      Purpose of Contact
                    </label>
                    <select
                      id="purpose"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      className={`input-field ${errors.purpose ? 'border-error-500 focus:ring-error-500' : ''}`}
                    >
                      <option value="">Select a purpose</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="feedback">Feedback or Suggestion</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.purpose && (
                      <p className="mt-1 text-sm text-error-600">{errors.purpose}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`input-field ${errors.subject ? 'border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="How can we help you?"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-error-600">{errors.subject}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className={`input-field ${errors.message ? 'border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="Please provide as much detail as possible..."
                    ></textarea>
                    {errors.message && (
                      <p className="mt-1 text-sm text-error-600">{errors.message}</p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary py-3 w-full flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
            
            {/* FAQs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <motion.div 
                    key={index}
                    className="border-b border-gray-200 pb-6 last:border-b-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Still have questions?</h3>
                <p className="text-gray-600 mb-4">
                  Check out our comprehensive FAQ section for more information or contact us directly.
                </p>
                <a href="/faq" className="btn-outline py-2 inline-block">
                  Visit FAQ Page
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Call To Action */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
            <p className="text-xl text-primary-100 mb-8">
              Start reducing food waste and making a difference in your community today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/auth/signup" className="btn bg-white text-primary-600 hover:bg-gray-100 focus:ring-white">
                Sign Up Now
              </a>
              <a href="/how-it-works" className="btn bg-transparent border-2 border-white text-white hover:bg-primary-700 focus:ring-white">
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;