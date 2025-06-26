import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const CookiePolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navigation />

      <div className="w-full px-6 py-12 max-w-6xl mx-auto text-sm text-gray-800 mt-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
          <p className="text-base text-gray-500">Learn how we use cookies and how you can manage them.</p>
        </div>

        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. What Are Cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help us enhance your browsing experience, remember your preferences, and analyze traffic patterns.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Types of Cookies We Use</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Essential Cookies:</strong> Necessary for website functionality (e.g., login, session management).</li>
              <li><strong>Performance Cookies:</strong> Help us understand how users interact with our website (e.g., Google Analytics).</li>
              <li><strong>Functionality Cookies:</strong> Remember your settings and preferences (e.g., language, theme).</li>
              <li><strong>Marketing Cookies:</strong> Used for advertising and tracking user behavior across platforms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. How to Manage Cookies</h2>
            <p>You can manage or disable cookies at any time through your browser settings. Most browsers allow you to block or delete cookies from specific websites or all websites entirely.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Third-Party Cookies</h2>
            <p>We may allow third-party services (like YouTube, Google, or Meta) to set cookies through our website for analytics or embedded content. These are governed by the third-party’s own cookie policies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Consent</h2>
            <p>By continuing to use our website, you consent to the placement of cookies on your device as described in this policy. You may withdraw your consent at any time by adjusting your browser settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Contact Us</h2>
            <p>For questions about this cookie policy, contact us at <a href="mailto:support@yourdomain.com" className="text-orange-500 underline">support@yourdomain.com</a>.</p>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CookiePolicy;
