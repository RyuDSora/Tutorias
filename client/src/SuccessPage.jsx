import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import axios from 'axios';

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handlePageLoad = async () => {
      try {
        // Obtener el token de autenticación del usuario
        const token = localStorage.getItem('token');

        // Enviar una solicitud al servidor para limpiar el carrito y registrar la orden
        await axios.get(`${import.meta.env.VITE_API_URL}/success`, {
          headers: {
            Authorization: token,
          },
        });
      } catch (error) {
        console.error('Error al procesar la orden:', error);
      }
    };

    handlePageLoad();
  }, [navigate]);

  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-green-600">Pago Exitoso</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-3xl">¡Tu pago se ha realizado con éxito! Gracias por tu compra.</h1>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SuccessPage;
