import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navigation />

      <div className="w-full px-6 py-12 max-w-6xl mx-auto text-sm text-gray-800 mt-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-base text-gray-500">Understand how we collect, use, and protect your data.</p>
        </div>

        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Personal Information: Your name, email address, and contact details.</li>
              <li>Usage Data: Information on how you interact with our platform.</li>
              <li>Cookies and Tracking: Data collected through cookies, device information, and IP address.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To personalize user experience and improve our services.</li>
              <li>To communicate important updates, newsletters, or service alerts.</li>
              <li>To ensure the security and integrity of our platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
            <p>We use encryption, access control, and secure servers to protect your data. While we strive to use commercially acceptable means, no method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Sharing & Disclosure</h2>
            <p>Your personal data is never sold. We may share your information only with trusted service providers for necessary operations (like email delivery), under strict confidentiality agreements.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>You may request to access, update, or delete your personal data.</li>
              <li>You can opt out of marketing emails at any time.</li>
              <li>You may disable cookies in your browser settings if preferred.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Policy Updates</h2>
            <p>This privacy policy may be updated from time to time. We will notify you of changes by updating the “Last updated” date at the top of this page.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Contact Us</h2>
            <p>For questions regarding this policy, contact us at <a href="mailto:bd@dronesimulator.pro" className="text-orange-500 underline">support@yourdomain.com</a>.</p>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;
