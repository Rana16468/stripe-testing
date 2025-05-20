// src/components/CheckoutForm.tsx
import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({ handleSubmit, loading, error }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <div className="mb-4">
          <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-2">
            Credit or debit card
          </label>
          <div className="border border-gray-300 p-4 rounded-md bg-white">
            <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`${
          loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        } w-full py-3 px-4 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default CheckoutForm;