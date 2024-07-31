import React from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe('pk_test_51PiHnr2KRPeDwuZFCAB1w7KMHZfqM4C1uQC1Ba9WQncYBSTcgHQGq1bgPgENk5dV0avTNamCENrWiygqkyJrE17F00ZTlNurK1');

const SubscriptionForm = () => {
  const { plan } = useParams();

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#336A41', fontFamily: 'Clear Sans Light, sans-serif' }}>Ingrese sus detalles de pago</h1>
      <Elements stripe={stripePromise}>
        <PaymentForm plan={plan} />
      </Elements>
    </div>
  );
};

export default SubscriptionForm;
