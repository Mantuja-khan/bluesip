const TermsConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Terms & Conditions - Blue Sip</h1>

      <p className="mb-4">
        By using the Blue Sip website and purchasing our products, you agree to
        the following terms and conditions.
      </p>

      <h3 className="font-semibold mt-4">Business Information</h3>
      <p>Blue Sip is a packaged drinking water bottle brand operating in India.</p>

      <h3 className="font-semibold mt-4">Product Information</h3>
      <p>
        Product images are for representation purposes only. Actual packaging
        may vary slightly.
      </p>

      <h3 className="font-semibold mt-4">Pricing & Payments</h3>
      <ul className="list-disc ml-6">
        <li>All prices are in INR</li>
        <li>Payments are securely processed via Razorpay</li>
        <li>Prices may change without notice</li>
      </ul>

      <h3 className="font-semibold mt-4">Order Confirmation</h3>
      <p>
        After successful payment, order confirmation will be sent via email or
        SMS.
      </p>

      <h3 className="font-semibold mt-4">Fraud Prevention</h3>
      <p>Any fraudulent activity may result in order cancellation.</p>

      <h3 className="font-semibold mt-4">Contact</h3>
      <p>Email: support@bluesip.in</p>
    </div>
  );
};

export default TermsConditions;
