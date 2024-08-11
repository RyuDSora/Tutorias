import { useNavigate, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { encryptionKey,decryptValue } from './components/hashes';
import Cookies from 'js-cookie';
import { URLsuscription } from './components/Urls';

const SuccessPage = () => {
  const navigate = useNavigate();
  const saveSubs = async() =>{
    const user_id = parseInt(decryptValue(Cookies.get('#gt156'),encryptionKey));
    const plan_id = sessionStorage.getItem('priceId');
    const subscription_date = new Date();
    const status = true;

    const response = await fetch(URLsuscription, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id, plan_id, subscription_date, status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al registrar usuario');
    }
    try {
      
    } catch (error) {
      console.log(error);
      
    }
    navigate('/')
  }
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold" style={{ color: '#336A41', fontFamily: 'Clear Sans Light, sans-serif' }}>
          Pago Exitoso
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-3xl" style={{ color: '#336A41', fontFamily: 'Clear Sans Light, sans-serif' }}>
          ¡Tu pago se ha realizado con éxito! Gracias por tu compra.
        </h1>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button
            onClick={() => saveSubs()}
            className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: '#336A41', fontFamily: 'Clear Sans Light, sans-serif' }}
          >
            Ir al inicio
          </Button>
        </div>
      </div>
    </main>
  );
};

export default SuccessPage;
