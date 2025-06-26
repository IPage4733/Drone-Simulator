import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const TermsAndConditions: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navigation />

      <div className="w-full px-6 py-12 max-w-6xl mx-auto text-sm text-gray-800 mt-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms & Privacy Policy</h1>
          <p className="text-base text-gray-500">Please review our terms and data policies carefully before continuing.</p>
        </div>

        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Terms of Use</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>You must be 18 years or older or have parental consent to use this service.</li>
              <li>Unauthorized or illegal use of this platform is strictly prohibited.</li>
              <li>All content, trademarks, and intellectual property are owned by our organization.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Privacy Policy</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>We collect your name, email, and basic usage data to improve services.</li>
              <li>Your data will not be sold or shared without your consent.</li>
              <li>We implement industry-standard security practices to protect your data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Cookies and Analytics</h2>
            <p>We use cookies to analyze traffic and enhance your experience. You can control cookie preferences in your browser settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Modifications</h2>
            <p>We reserve the right to update our Terms & Policy at any time. Changes will be posted on this page, and your continued use constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Contact Information</h2>
            <p>For any concerns or inquiries, please email us at <a href="mailto:support@yourdomain.com" className="text-orange-500 underline">support@yourdomain.com</a>.</p>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TermsAndConditions;
