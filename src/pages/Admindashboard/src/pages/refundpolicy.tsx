import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const RefundPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navigation />

      <div className="w-full px-6 py-12 max-w-6xl mx-auto text-sm text-gray-800 mt-20">
        <div className="text-center mb-10">
        
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund Policy</h1>
          <p className="text-base text-gray-500">Please read our refund policy before making a payment or subscription.</p>
        </div>

        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Eligibility for Refund</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Refunds are only available for payments made within the last 7 calendar days.</li>
              <li>You must provide a valid reason for requesting a refund (e.g., technical issues, accidental payments).</li>
              <li>Requests without valid justification may be declined at our discretion.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Non-Refundable Items</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Fees paid for training, certification, or digital products already delivered are non-refundable.</li>
              <li>Customized or discounted purchases are final and cannot be refunded.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Refund Process</h2>
            <p>
              To request a refund, please email us at <a href="mailto:support@yourdomain.com" className="text-orange-500 underline">support@yourdomain.com</a> with your order ID, email, and reason for the refund.
              Approved refunds will be processed within 7-10 business days to the original payment method.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Contact</h2>
            <p>If you have questions regarding our refund policy, please contact our support team at <a href="mailto:support@yourdomain.com" className="text-orange-500 underline">support@yourdomain.com</a>.</p>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RefundPolicy;
