// src/pages/CheckoutPage.tsx
import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import ProductList from '../components/ProductList';
import CheckoutForm from '../components/CheckoutForm';


// Define sample products
const products = [
  { id: '1', name: 'Product 1', price: 19.99, image: '/api/placeholder/100/100' },
  { id: '2', name: 'Product 2', price: 29.99, image: '/api/placeholder/100/100' },
  { id: '3', name: 'Product 3', price: 39.99, image: '/api/placeholder/100/100' },
];

const CheckoutPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [cart, setCart] = useState<Array<{ id: string; name: string; price: number; quantity: number }>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const stripe = useStripe();
  const elements = useElements();

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const addToCart = (product: { id: string; name: string; price: number }) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads or cart changes
    if (cart.length > 0) {
      const fetchPaymentIntent = async () => {
        try {
          setLoading(true);
          const response = await axios.post('http://localhost:3051/api/v1/payment_gateway/create-payment-intent', {
            amount: calculateTotal(),
            currency: 'usd',
            items: cart
          });
          setClientSecret(response.data.clientSecret);
        } catch (err) {
          setError('Failed to initialize payment. Please try again.');
          console.error('Error:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchPaymentIntent();
    }
  }, [cart]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer Name', // In a real app, collect this from the user
          },
        },
      });

      if (error) {
        setError(error.message || 'An error occurred during payment');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful, redirect to success page
        window.location.href = '/success';
      } else {
        setError('Payment processing failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <ProductList 
            products={products}
            addToCart={addToCart}
          />
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-600">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 px-2 py-1 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 px-2 py-1 rounded"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          {cart.length > 0 ? (
            <>
              {clientSecret && (
                <CheckoutForm
                  handleSubmit={handleSubmit}
                  loading={loading}
                  error={error}
                />
              )}
            </>
          ) : (
            <p className="text-gray-500">Add items to your cart to proceed with payment</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;