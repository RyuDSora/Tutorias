import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const plans = [
  { name: 'Plan Básico', price: '$20', features: ['Acceso a tutores básicos', '1 sesión al mes'], id: 'plan_basico' },
  { name: 'Plan Estándar', price: '$40', features: ['Acceso a tutores estándar', '3 sesiones al mes'], id: 'plan_estandar' },
  { name: 'Plan Avanzado', price: '$80', features: ['Acceso a tutores avanzados', '5 sesiones al mes'], id: 'plan_avanzado' },
  { name: 'Plan Premium', price: '$160', features: ['Acceso a todos los tutores', 'Sesiones ilimitadas'], id: 'plan_premium' },
];

const SubscriptionPlans = () => {
  const navigate = useNavigate();

  const handlePlanSelection = async (plan) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/cart`,
        { planId: plan.id, planName: plan.name, planPrice: plan.price },
        {
          headers: {
            Authorization: token,
          }
        }
      );
      navigate('/carrito');
    } catch (error) {
      console.error('Error al agregar el plan al carrito:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="container mx-auto my-12">
      <h1 className="text-center text-3xl font-bold mb-8" style={{ color: '#336A41', fontFamily: 'Clear Sans Light, sans-serif' }}>Planes de Suscripción</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan, index) => (
          <div key={index} className="border-2 border-gray-300 rounded-lg shadow-lg p-6 flex flex-col justify-between" style={{ borderColor: '#336A41' }}>
            <div>
              <h2 className="text-xl font-semibold text-center mb-4" style={{ color: '#336A41', fontFamily: 'Clear Sans Light, sans-serif' }}>{plan.name}</h2>
              <p className="text-2xl text-center mb-6" style={{ color: '#5c90bd', fontFamily: 'Clear Sans Light, sans-serif' }}>{plan.price}</p>
              <ul className="list-disc list-inside mb-6" style={{ fontFamily: 'Clear Sans Light, sans-serif' }}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-gray-700 mb-2">{feature}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => handlePlanSelection(plan)}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              style={{ backgroundColor: '#336A41', fontFamily: 'Clear Sans Light, sans-serif' }}
            >
              Seleccionar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
