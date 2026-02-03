const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy - Blue Sip</h1>

      <p>
        Blue Sip respects your privacy and is committed to protecting your
        personal information.
      </p>

      <h3 className="font-semibold mt-4">Information We Collect</h3>
      <ul className="list-disc ml-6">
        <li>Name, email, phone number</li>
        <li>Shipping address</li>
        <li>Payment data processed securely by Razorpay</li>
      </ul>

      <h3 className="font-semibold mt-4">Usage of Information</h3>
      <p>
        Information is used for order processing, delivery and customer support.
      </p>

      <h3 className="font-semibold mt-4">Payment Security</h3>
      <p>
        Blue Sip does not store card or UPI details. Payments are handled by
        Razorpay securely.
      </p>

      <h3 className="font-semibold mt-4">Contact</h3>
      <p>Email: support@bluesip.in</p>
    </div>
  );
};

export default PrivacyPolicy;
