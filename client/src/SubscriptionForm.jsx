import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';

const SubscriptionForm = ({ plan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscribe = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:3000/create-checkout-session', { plan });
      const sessionId = response.data.id;

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage(`Error creating checkout session: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubscribe}>
      <CardElement />
      <button type="submit" className="btn-primary mt-4" disabled={!stripe || !elements || loading}>
        {loading ? 'Loading...' : 'Suscribirse'}
      </button>
      {message && <div className="mt-4 text-red-600">{message}</div>}
    </form>
  );
};

export default SubscriptionForm;
