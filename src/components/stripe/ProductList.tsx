import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';


// Replace with your actual Stripe public key
const stripePromise = loadStripe('pk_test_51RJJ0DIPrRs1II3i1W7UePGgywKV7hR7N1DsJOMwms2TsuCPzQ3fuhGXZn2obj72cfw4Rq9gyqFJlCY8uBjQzQHZ007gdMBHVs');

const ProductList: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Product List</h2>

      {/* Example products */}
      <ul className="mb-6">
        <li>Product A - $100.00</li>
        <li>Product B - $50.00</li>
      </ul>

      {/* Stripe Elements provider and payment form */}
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </div>
  );
};

export default ProductList;
