import React from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = ({ plan }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubscribe = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/create-subscription`, { plan });
      const sessionId = response.data.id;

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <form onSubmit={handleSubscribe}>
      <CardElement />
      <button type="submit" className="btn-primary mt-4" disabled={!stripe || !elements}>
        Suscribirse
      </button>
    </form>
  );
};

export default PaymentForm;
