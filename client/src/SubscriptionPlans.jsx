import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const API_URL = import.meta.env.VITE_API_URL;

const plans = [
  { plan: 'basic', name: 'Plan Básico', price: '$20', features: ['Acceso a clases básicas'] },
  { plan: 'standard', name: 'Plan Estándar', price: '$40', features: ['Acceso a clases estándar'] },
  { plan: 'advanced', name: 'Plan Avanzado', price: '$80', features: ['Acceso a clases avanzadas'] },
  { plan: 'premium', name: 'Plan Premium', price: '$160', features: ['Acceso a todas las clases'] },
];

const SubscriptionPlans = () => {
  const navigate = useNavigate();

  const handleSelectPlan = async (plan) => {
    const stripe = await stripePromise;
    console.log(`API URL: ${API_URL}/create-checkout-session`); // Verifica que la URL sea correcta
    try {
      const response = await axios.post(`${API_URL}/create-checkout-session`, { plan });
      const sessionId = response.data.id;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error('Error redirecting to checkout:', error);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#336A41', fontFamily: 'Clear Sans Light, sans-serif' }}>Suscripciones</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div key={plan.plan} className="border p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#336A41', fontFamily: 'Clear Sans Light, sans-serif' }}>{plan.name}</h2>
            <p className="text-2xl mb-4">{plan.price}</p>
            <ul className="mb-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="mb-2">{feature}</li>
              ))}
            </ul>
            <button onClick={() => handleSelectPlan(plan.plan)} className="btn-primary">
              Seleccionar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
