import React from "react";
import { motion } from "framer-motion";

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Terms and Rules
          </h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. General Terms</h2>
              <p className="mb-4">
                By accessing and using FoodShare, you agree to comply with and
                be bound by these terms and conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">
                2. User Responsibilities
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Provide accurate and complete information during registration
                </li>
                <li>Maintain the security of your account credentials</li>
                <li>Report any suspicious activities or violations</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">
                3. Food Safety Guidelines
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ensure all donated food meets safety standards</li>
                <li>Properly package and label all food items</li>
                <li>Maintain appropriate temperature controls</li>
                <li>Follow food handling best practices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Privacy Policy</h2>
              <p className="mb-4">
                We respect your privacy and are committed to protecting your
                personal information. Your data will be used only for the
                purposes specified in our privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">
                5. NGO Certification
              </h2>
              <p className="mb-4">
                Organizations must provide valid NGO certification and maintain
                compliance with all relevant regulations. Regular verification
                of certification status may be required.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">
                6. Dispute Resolution
              </h2>
              <p className="mb-4">
                Any disputes arising from the use of FoodShare will be resolved
                through mediation and arbitration in accordance with our dispute
                resolution policy.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;
